const service = require('./calificacion.service');

/**
 * POST /api/calificacion/usuario
 * El usuario califica al instructor por una reserva completada.
 */
async function calificarComoUsuario(req, res, next) {
  try {
    const { idReserva, puntuacion, comentario } = req.body;
    const calificacion = await service.calificarComoUsuario(idReserva, { puntuacion, comentario });
    res.status(201).json(calificacion);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/calificacion/instructor
 * El instructor califica al usuario por una reserva completada.
 */
async function calificarComoInstructor(req, res, next) {
  try {
    const { idReserva, puntuacion, comentario } = req.body;
    const calificacion = await service.calificarComoInstructor(idReserva, { puntuacion, comentario });
    res.status(201).json(calificacion);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/calificacion/reserva/:idReserva
 * Consulta la calificación (ambos lados) de una reserva.
 */
async function buscarPorReserva(req, res, next) {
  try {
    const { idReserva } = req.params;
    const calificacion = await service.buscarPorReserva(idReserva);
    res.status(200).json(calificacion);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  calificarComoUsuario,
  calificarComoInstructor,
  buscarPorReserva,
};
