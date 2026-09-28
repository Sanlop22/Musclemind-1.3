const repository = require('./calificacion.repository');
const Calificacion = require('./calificacion.model');
const reservaService = require('../reserva/reserva.service');

/**
 * Error de negocio: se intentó calificar una reserva que todavía no
 * está en estado "completada".
 */
class ReservaNoCompletadaError extends Error {
  constructor() {
    super('Solo se puede calificar una reserva que ya esté completada.');
    this.status = 409;
  }
}

/**
 * Verifica la regla de negocio compartida por ambos lados de la
 * calificación: la reserva debe existir y estar "completada".
 * Cruza con el módulo reserva a través de su Service (nunca directo
 * a su Repository), respetando el límite entre módulos.
 */
async function verificarReservaCompletada(idReserva) {
  const reserva = await reservaService.buscarPorId(idReserva); // lanza ReservaNoEncontradaError si no existe
  if (reserva.estado !== 'completada') {
    throw new ReservaNoCompletadaError();
  }
}

/**
 * Registra la calificación que el USUARIO le da al INSTRUCTOR por una
 * reserva ya completada. Si la reserva todavía no tiene fila de
 * calificación, la crea; si ya tiene (por ejemplo, porque el
 * instructor ya calificó primero), solo actualiza su lado.
 */
async function calificarComoUsuario(idReserva, { puntuacion, comentario = null }) {
  await verificarReservaCompletada(idReserva);

  const calificacionExistente = await repository.buscarPorReserva(idReserva);

  if (calificacionExistente) {
    await repository.actualizarLadoUsuario(idReserva, { puntuacion, comentario });
  } else {
    await repository.crear({
      idReserva,
      puntuacionUsuarioAInstructor: puntuacion,
      comentarioUsuarioAInstructor: comentario,
    });
  }

  const actualizada = await repository.buscarPorReserva(idReserva);
  return new Calificacion(actualizada);
}

/**
 * Registra la calificación que el INSTRUCTOR le da al USUARIO por una
 * reserva ya completada. Misma lógica de upsert que el lado usuario.
 */
async function calificarComoInstructor(idReserva, { puntuacion, comentario = null }) {
  await verificarReservaCompletada(idReserva);

  const calificacionExistente = await repository.buscarPorReserva(idReserva);

  if (calificacionExistente) {
    await repository.actualizarLadoInstructor(idReserva, { puntuacion, comentario });
  } else {
    await repository.crear({
      idReserva,
      puntuacionInstructorAUsuario: puntuacion,
      comentarioInstructorAUsuario: comentario,
    });
  }

  const actualizada = await repository.buscarPorReserva(idReserva);
  return new Calificacion(actualizada);
}

/**
 * Consulta la calificación de una reserva (ambos lados, si existen).
 */
async function buscarPorReserva(idReserva) {
  const calificacion = await repository.buscarPorReserva(idReserva);
  if (!calificacion) {
    const error = new Error('Esa reserva todavía no tiene ninguna calificación registrada.');
    error.status = 404;
    throw error;
  }
  return new Calificacion(calificacion);
}

module.exports = {
  calificarComoUsuario,
  calificarComoInstructor,
  buscarPorReserva,
  ReservaNoCompletadaError,
};
