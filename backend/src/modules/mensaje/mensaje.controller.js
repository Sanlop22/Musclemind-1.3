const service = require('./mensaje.service');

/**
 * POST /api/mensaje
 * Envía un nuevo mensaje entre un usuario y un instructor.
 */
async function crear(req, res, next) {
  try {
    const { idUsuario, idInstructor, remitente, contenido } = req.body;
    const nuevoMensaje = await service.crearMensaje({ idUsuario, idInstructor, remitente, contenido });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/mensaje/conversacion/:idUsuario/:idInstructor
 * Devuelve la conversación completa entre un usuario y un instructor.
 */
async function listarConversacion(req, res, next) {
  try {
    const { idUsuario, idInstructor } = req.params;
    const conversacion = await service.listarConversacion(idUsuario, idInstructor);
    res.status(200).json(conversacion);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crear,
  listarConversacion,
};
