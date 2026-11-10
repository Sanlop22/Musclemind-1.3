

const service = require('./mensaje.service');

/**
 * Envía un mensaje.
 */
async function crear(req, res, next) {
  try {
    const { idUsuario, idInstructor, remitente, contenido } = req.body;

    const nuevoMensaje = await service.crearMensaje({
      idUsuario,
      idInstructor,
      remitente,
      contenido
    });

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    next(error);
  }
}

/**
 * Consulta los mensajes de una conversación.
 */
async function listarConversacion(req, res, next) {
  try {
    const { idUsuario, idInstructor } = req.params;

    const conversacion = await service.listarConversacion(
      idUsuario,
      idInstructor
    );

    res.status(200).json(conversacion);
  } catch (error) {
    next(error);
  }
}

/**
 * Lista las conversaciones del instructor autenticado.
 */
async function listarConversacionesPorInstructor(req, res, next) {
  try {
    const idInstructor = req.user.id_instructor;

    const conversaciones =
      await service.listarConversacionesPorInstructor(idInstructor);

    res.status(200).json(conversaciones);
  } catch (error) {
    next(error);
  }
}

/**
 * Lista las conversaciones del deportista autenticado.
 */
async function listarConversacionesPorUsuario(req, res, next) {
  try {
    const idUsuario = req.user.id_usuario;

    const conversaciones =
      await service.listarConversacionesPorUsuario(idUsuario);

    res.status(200).json(conversaciones);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crear,
  listarConversacion,
  listarConversacionesPorInstructor,
  listarConversacionesPorUsuario
};
