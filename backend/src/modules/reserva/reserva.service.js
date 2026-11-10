
const repository = require('./reserva.repository');
const Reserva = require('./reserva.model');
const pool = require('../../database/connection');
const disponibilidadService = require('../disponibilidad/disponibilidad.service');

const DIAS = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado'
];

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
    super('Este horario ya no está disponible. Selecciona otro horario.');
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

function horaAMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function seSolapan(inicioA, finA, inicioB, finB) {
  return (
    horaAMinutos(inicioA) < horaAMinutos(finB) &&
    horaAMinutos(inicioB) < horaAMinutos(finA)
  );
}

function obtenerDiaSemana(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return DIAS[fecha.getDay()];
}

async function crearReserva({
  idUsuario,
  idInstructor,
  idRutina,
  objetivo,
  fecha,
  horaInicio,
  horaFin,
  precio
}) {
  if (horaAMinutos(horaFin) <= horaAMinutos(horaInicio)) {
    throw new RangoHorarioInvalidoError();
  }

  const conexion = await pool.getConnection();
  let transaccionIniciada = false;

  try {
    await conexion.beginTransaction();
    transaccionIniciada = true;

    const instructor = await repository.bloquearInstructor(
      idInstructor,
      conexion
    );

    if (!instructor) {
      throw new Error('El instructor no existe.');
    }

    const diaSemana = obtenerDiaSemana(fecha);

    const bloquesDelInstructor =
      await disponibilidadService.listarPorInstructor(idInstructor);

    console.log('Día calculado:', diaSemana);
    console.log('Disponibilidad del instructor:', bloquesDelInstructor);

    const hayBloqueDisponible = bloquesDelInstructor.some(
      (bloque) =>
        bloque.dia_semana === diaSemana &&
        bloque.estado === 'disponible' &&
        horaAMinutos(bloque.hora_inicio) <= horaAMinutos(horaInicio) &&
        horaAMinutos(horaFin) <= horaAMinutos(bloque.hora_fin)
    );

    if (!hayBloqueDisponible) {
      throw new FueraDeDisponibilidadError();
    }

    const reservasExistentes =
      await repository.buscarPorInstructorYFecha(
        idInstructor,
        fecha,
        conexion
      );

    const hayHorarioOcupado = reservasExistentes.some((reserva) =>
      seSolapan(
        horaInicio,
        horaFin,
        reserva.hora_inicio,
        reserva.hora_fin
      )
    );

    if (hayHorarioOcupado) {
      throw new SolapamientoReservaError();
    }

    const idReserva = await repository.crear(
      {
        idUsuario,
        idInstructor,
        idRutina,
        objetivo,
        fecha,
        horaInicio,
        horaFin,
        precio
      },
      conexion
    );

    await conexion.commit();
    transaccionIniciada = false;

    const creada = await repository.buscarPorId(idReserva);

    return new Reserva(creada);

  } catch (error) {
    if (transaccionIniciada) {
      await conexion.rollback();
    }

    throw error;

  } finally {
    conexion.release();
  }
}

// Consulta los horarios ocupados de un instructor en una fecha.
async function listarHorariosOcupados(idInstructor, fecha) {
  const reservas = await repository.buscarPorInstructorYFecha(
    idInstructor,
    fecha
  );

  return reservas.map((reserva) => ({
    hora_inicio: reserva.hora_inicio,
    hora_fin: reserva.hora_fin
  }));
}

async function listarPorUsuario(idUsuario) {
  const reservas = await repository.listarPorUsuario(idUsuario);
  return reservas.map((r) => new Reserva(r));
}

async function listarPorInstructor(idInstructor) {
  const reservas = await repository.listarPorInstructor(idInstructor);
  return reservas.map((r) => new Reserva(r));
}

async function buscarPorId(idReserva) {
  const reserva = await repository.buscarPorId(idReserva);

  if (!reserva) {
    throw new ReservaNoEncontradaError();
  }

  return new Reserva(reserva);
}

async function cambiarEstado(idReserva, nuevoEstado) {
  const reserva = await repository.buscarPorId(idReserva);

  if (!reserva) {
    throw new ReservaNoEncontradaError();
  }

  if (
    reserva.estado === 'completada' ||
    reserva.estado === 'cancelada'
  ) {
    throw new TransicionEstadoInvalidaError(
      `No se puede modificar una reserva en estado "${reserva.estado}".`
    );
  }

  if (nuevoEstado === 'completada') {
    const fechaHoraFin = new Date(
      `${reserva.fecha}T${reserva.hora_fin}`
    );

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
  listarHorariosOcupados,
  listarPorUsuario,
  listarPorInstructor,
  buscarPorId,
  cambiarEstado,
  RangoHorarioInvalidoError,
  FueraDeDisponibilidadError,
  SolapamientoReservaError,
  ReservaNoEncontradaError,
  TransicionEstadoInvalidaError
};

