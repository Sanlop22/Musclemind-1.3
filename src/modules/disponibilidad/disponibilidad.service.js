const repository = require('./disponibilidad.repository');
const Disponibilidad = require('./disponibilidad.model');

/**
 * Error de negocio: rango horario inválido (hora_fin <= hora_inicio).
 */
class RangoHorarioInvalidoError extends Error {
  constructor() {
    super('La hora de fin debe ser mayor que la hora de inicio.');
    this.status = 400;
  }
}

/**
 * Error de negocio: el nuevo bloque se solapa con uno ya existente
 * del mismo instructor, el mismo día.
 */
class SolapamientoError extends Error {
  constructor() {
    super('Ya existe un bloque de disponibilidad que se solapa con este horario.');
    this.status = 409;
  }
}

/**
 * Compara dos rangos horarios (strings "HH:MM") y determina si se solapan.
 * Dos rangos se solapan si uno empieza antes de que el otro termine,
 * en ambas direcciones.
 */
function horaAMinutos(hora) { const [h, m] = hora.split(':').map(Number); return h * 60 + m; } function seSolapan(inicioA, finA, inicioB, finB) { return horaAMinutos(inicioA) < horaAMinutos(finB) && horaAMinutos(inicioB) < horaAMinutos(finA); }

/**
 * Crea un nuevo bloque de disponibilidad.
 * Nota: idInstructor llega directo en el body por ahora, ya que el
 * proyecto no tiene JWT implementado todavía. Cuando se agregue
 * autenticación, este sería el único punto a ajustar (tomarlo de
 * req.user.id en el controller en vez del body) — el resto del
 * módulo no cambiaría.
 */
async function crearDisponibilidad({ idInstructor, diaSemana, horaInicio, horaFin }) {
  if (horaFin <= horaInicio) {
    throw new RangoHorarioInvalidoError();
  }

  const bloquesExistentes = await repository.buscarPorInstructorYDia(idInstructor, diaSemana);

  const haySolapamiento = bloquesExistentes.some((bloque) =>
    seSolapan(horaInicio, horaFin, bloque.hora_inicio, bloque.hora_fin)
  );

  if (haySolapamiento) {
    throw new SolapamientoError();
  }

  const idDisponibilidad = await repository.crear({ idInstructor, diaSemana, horaInicio, horaFin });
  const creado = await repository.buscarPorId(idDisponibilidad);
  return new Disponibilidad(creado);
}

/**
 * Lista todos los bloques de un instructor (su agenda completa).
 */
async function listarPorInstructor(idInstructor) {
  const bloques = await repository.listarPorInstructor(idInstructor);
  return bloques.map((b) => new Disponibilidad(b));
}

/**
 * Actualiza un bloque existente, re-validando las mismas reglas
 * de negocio (rango horario y solapamiento), excluyendo el propio
 * bloque que se está editando de la comparación.
 */
async function actualizarDisponibilidad(idDisponibilidad, { diaSemana, horaInicio, horaFin, estado }) {
  if (horaFin <= horaInicio) {
    throw new RangoHorarioInvalidoError();
  }

  const bloqueActual = await repository.buscarPorId(idDisponibilidad);
  if (!bloqueActual) {
    const error = new Error('No existe un bloque de disponibilidad con ese id.');
    error.status = 404;
    throw error;
  }

  const bloquesExistentes = await repository.buscarPorInstructorYDia(bloqueActual.id_instructor, diaSemana);

  const haySolapamiento = bloquesExistentes.some((bloque) =>
    bloque.id_disponibilidad !== idDisponibilidad &&
    seSolapan(horaInicio, horaFin, bloque.hora_inicio, bloque.hora_fin)
  );

  if (haySolapamiento) {
    throw new SolapamientoError();
  }

  await repository.actualizar(idDisponibilidad, { diaSemana, horaInicio, horaFin, estado });
  const actualizado = await repository.buscarPorId(idDisponibilidad);
  return new Disponibilidad(actualizado);
}

async function eliminarDisponibilidad(idDisponibilidad) {
  const eliminado = await repository.eliminar(idDisponibilidad);
  if (!eliminado) {
    const error = new Error('No existe un bloque de disponibilidad con ese id.');
    error.status = 404;
    throw error;
  }
}

module.exports = {
  crearDisponibilidad,
  listarPorInstructor,
  actualizarDisponibilidad,
  eliminarDisponibilidad,
  RangoHorarioInvalidoError,
  SolapamientoError,
};
