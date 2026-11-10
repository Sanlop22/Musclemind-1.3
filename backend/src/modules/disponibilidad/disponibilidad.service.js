const repository = require('./disponibilidad.repository');
const Disponibilidad = require('./disponibilidad.model');

/**
 * Error de negocio: rango horario inválido.
 */
class RangoHorarioInvalidoError extends Error {
  constructor() {
    super('La hora de fin debe ser mayor que la hora de inicio.');
    this.status = 400;
  }
}

/**
 * Error de negocio: horario que coincide con otro registrado.
 */
class SolapamientoError extends Error {
  constructor() {
    super('Este horario coincide con otro que ya tienes registrado. Por favor, elige un horario diferente.');
    this.status = 409;
  }
}

/**
 * Convierte una hora HH:MM a minutos.
 */
function horaAMinutos(hora) {
  const [h, m] = String(hora).slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

/**
 * Comprueba si dos horarios se cruzan.
 */
function seSolapan(inicioA, finA, inicioB, finB) {
  return (
    horaAMinutos(inicioA) < horaAMinutos(finB) &&
    horaAMinutos(inicioB) < horaAMinutos(finA)
  );
}

/**
 * Crea un nuevo bloque de disponibilidad.
 */
async function crearDisponibilidad({
  idInstructor,
  diaSemana,
  horaInicio,
  horaFin
}) {
  if (horaFin <= horaInicio) {
    throw new RangoHorarioInvalidoError();
  }

  const bloquesExistentes =
    await repository.buscarPorInstructorYDia(
      idInstructor,
      diaSemana
    );

  const haySolapamiento = bloquesExistentes.some((bloque) =>
    seSolapan(
      horaInicio,
      horaFin,
      bloque.hora_inicio,
      bloque.hora_fin
    )
  );

  if (haySolapamiento) {
    throw new SolapamientoError();
  }

  const idDisponibilidad = await repository.crear({
    idInstructor,
    diaSemana,
    horaInicio,
    horaFin
  });

  const creado = await repository.buscarPorId(idDisponibilidad);

  return new Disponibilidad(creado);
}

/**
 * Lista todos los bloques de un instructor.
 */
async function listarPorInstructor(idInstructor) {
  const bloques = await repository.listarPorInstructor(idInstructor);

  return bloques.map((bloque) => new Disponibilidad(bloque));
}

/**
 * Busca un bloque por su identificador.
 */
async function buscarPorId(idDisponibilidad) {
  const bloque = await repository.buscarPorId(idDisponibilidad);

  if (!bloque) {
    const error = new Error(
      'No existe un bloque de disponibilidad con ese id.'
    );

    error.status = 404;
    throw error;
  }

  return new Disponibilidad(bloque);
}

/**
 * Actualiza un bloque existente.
 */
async function actualizarDisponibilidad(
  idDisponibilidad,
  { diaSemana, horaInicio, horaFin, estado }
) {
  const bloqueActual = await repository.buscarPorId(idDisponibilidad);

  if (!bloqueActual) {
    const error = new Error(
      'No existe un bloque de disponibilidad con ese id.'
    );

    error.status = 404;
    throw error;
  }

  const horaInicioActual = String(bloqueActual.hora_inicio).slice(0, 5);
  const horaFinActual = String(bloqueActual.hora_fin).slice(0, 5);

  const cambioHorario =
    diaSemana !== bloqueActual.dia_semana ||
    horaInicio !== horaInicioActual ||
    horaFin !== horaFinActual;

  if (horaFin <= horaInicio) {
    throw new RangoHorarioInvalidoError();
  }

  // Solo comprueba coincidencias cuando cambian el día o las horas.
  if (cambioHorario) {
    const bloquesExistentes =
      await repository.buscarPorInstructorYDia(
        bloqueActual.id_instructor,
        diaSemana
      );

    const haySolapamiento = bloquesExistentes.some((bloque) =>
      Number(bloque.id_disponibilidad) !== Number(idDisponibilidad) &&
      seSolapan(
        horaInicio,
        horaFin,
        String(bloque.hora_inicio).slice(0, 5),
        String(bloque.hora_fin).slice(0, 5)
      )
    );

    if (haySolapamiento) {
      throw new SolapamientoError();
    }
  }

  await repository.actualizar(idDisponibilidad, {
    diaSemana,
    horaInicio,
    horaFin,
    estado
  });

  const actualizado = await repository.buscarPorId(idDisponibilidad);

  return new Disponibilidad(actualizado);
}

/**
 * Elimina un bloque de disponibilidad.
 */
async function eliminarDisponibilidad(idDisponibilidad) {
  const eliminado = await repository.eliminar(idDisponibilidad);

  if (!eliminado) {
    const error = new Error(
      'No existe un bloque de disponibilidad con ese id.'
    );

    error.status = 404;
    throw error;
  }
}

module.exports = {
  crearDisponibilidad,
  listarPorInstructor,
  buscarPorId,
  actualizarDisponibilidad,
  eliminarDisponibilidad,
  RangoHorarioInvalidoError,
  SolapamientoError
};