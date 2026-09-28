const repository = require('./reserva.repository');
const Reserva = require('./reserva.model');
const disponibilidadService = require('../disponibilidad/disponibilidad.service');

const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

class RangoHorarioInvalidoError extends Error {
  constructor() {
    super('La hora de fin debe ser mayor que la hora de inicio.');
    this.status = 400;
  }
}

class FueraDeDisponibilidadError extends Error {
  constructor() {
    super('El instructor no tiene disponibilidad para ese día y horario.');
    this.status = 409;
  }
}

class SolapamientoReservaError extends Error {
  constructor() {
    super('El instructor ya tiene una reserva activa que se solapa con este horario.');
    this.status = 409;
  }
}

class ReservaNoEncontradaError extends Error {
  constructor() {
    super('No existe una reserva con ese id.');
    this.status = 404;
  }
}

class TransicionEstadoInvalidaError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.status = 400;
  }
}

/**
 * Convierte una hora en formato "HH:MM" o "HH:MM:SS" a minutos totales,
 * para poder comparar horas numéricamente en vez de como texto.
 * Esto es necesario porque MySQL devuelve las horas con segundos
 * ("06:00:00"), mientras que el body de la petición las envía sin
 * segundos ("06:00") — comparar los strings directamente da resultados
 * incorrectos en casos donde uno es prefijo del otro.
 */
function horaAMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function seSolapan(inicioA, finA, inicioB, finB) {
  return horaAMinutos(inicioA) < horaAMinutos(finB) && horaAMinutos(inicioB) < horaAMinutos(finA);
}

/**
 * Calcula el día de la semana (en español, minúsculas) de una fecha
 * en formato "YYYY-MM-DD", para poder cruzarlo contra dia_semana
 * de la tabla disponibilidad.
 */
function obtenerDiaSemana(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return DIAS[fecha.getDay()];
}

/**
 * Crea una reserva nueva.
 * idUsuario, idInstructor e idRutina llegan directo en el body por ahora
 * (el proyecto aún no tiene JWT). Cuando se agregue autenticación, el
 * único ajuste sería tomar idUsuario de req.user.id en el controller.
 */
async function crearReserva({ idUsuario, idInstructor, idRutina, objetivo, fecha, horaInicio, horaFin, precio }) {
  if (horaFin <= horaInicio) {
    throw new RangoHorarioInvalidoError();
  }

  const diaSemana = obtenerDiaSemana(fecha);

  // Cruce con el módulo disponibilidad: llamamos a su Service,
  // nunca directo a su Repository — así respetamos el límite entre módulos.
  const bloquesDelInstructor = await disponibilidadService.listarPorInstructor(idInstructor);

  const hayBloqueDisponible = bloquesDelInstructor.some(
    (bloque) =>
      bloque.dia_semana === diaSemana &&
      bloque.estado === 'disponible' &&
      horaAMinutos(horaInicio) >= horaAMinutos(bloque.hora_inicio) &&
      horaAMinutos(horaFin) <= horaAMinutos(bloque.hora_fin)
  );

  if (!hayBloqueDisponible) {
    throw new FueraDeDisponibilidadError();
  }

  const reservasExistentes = await repository.buscarPorInstructorYFecha(idInstructor, fecha);

  const haySolapamiento = reservasExistentes.some((reserva) =>
    seSolapan(horaInicio, horaFin, reserva.hora_inicio, reserva.hora_fin)
  );

  if (haySolapamiento) {
    throw new SolapamientoReservaError();
  }

  const idReserva = await repository.crear({ idUsuario, idInstructor, idRutina, objetivo, fecha, horaInicio, horaFin, precio });
  const creada = await repository.buscarPorId(idReserva);
  return new Reserva(creada);
}

async function listarPorUsuario(idUsuario) {
  const reservas = await repository.listarPorUsuario(idUsuario);
  return reservas.map((r) => new Reserva(r));
}

async function listarPorInstructor(idInstructor) {
  const reservas = await repository.listarPorInstructor(idInstructor);
  return reservas.map((r) => new Reserva(r));
}

/**
 * Busca una reserva por su id. Se agregó para que otros módulos
 * (como calificacion) puedan consultar el estado de una reserva sin
 * tocar el Repository de reserva directamente — solo su Service,
 * respetando el límite entre módulos.
 */
async function buscarPorId(idReserva) {
  const reserva = await repository.buscarPorId(idReserva);
  if (!reserva) {
    throw new ReservaNoEncontradaError();
  }
  return new Reserva(reserva);
}

/**
 * Cambia el estado de una reserva, aplicando reglas de transición:
 * - No se puede marcar "completada" si la fecha/hora de la reserva
 *   todavía no ha pasado (no se completa algo que no ha ocurrido).
 * - No se puede modificar una reserva que ya está "completada" o
 *   "cancelada" (son estados finales).
 */
async function cambiarEstado(idReserva, nuevoEstado) {
  const reserva = await repository.buscarPorId(idReserva);
  if (!reserva) {
    throw new ReservaNoEncontradaError();
  }

  if (reserva.estado === 'completada' || reserva.estado === 'cancelada') {
    throw new TransicionEstadoInvalidaError(
      `No se puede modificar una reserva en estado "${reserva.estado}".`
    );
  }

  if (nuevoEstado === 'completada') {
    const fechaHoraFin = new Date(`${reserva.fecha}T${reserva.hora_fin}`);
    if (fechaHoraFin > new Date()) {
      throw new TransicionEstadoInvalidaError(
        'No se puede completar una reserva cuya fecha y hora aún no han pasado.'
      );
    }
  }

  await repository.actualizarEstado(idReserva, nuevoEstado);
  const actualizada = await repository.buscarPorId(idReserva);
  return new Reserva(actualizada);
}

module.exports = {
  crearReserva,
  listarPorUsuario,
  listarPorInstructor,
  buscarPorId,
  cambiarEstado,
  RangoHorarioInvalidoError,
  FueraDeDisponibilidadError,
  SolapamientoReservaError,
  ReservaNoEncontradaError,
  TransicionEstadoInvalidaError,
};
