const repository = require('./mensaje.repository');
const Mensaje = require('./mensaje.model');

/**
 * Crea un nuevo mensaje dentro de la conversación entre un usuario y
 * un instructor.
 */
async function crearMensaje({ idUsuario, idInstructor, remitente, contenido }) {
  const idMensaje = await repository.crear({ idUsuario, idInstructor, remitente, contenido });
  const creado = await repository.buscarPorId(idMensaje);
  return new Mensaje(creado);
}

/**
 * Devuelve la conversación completa entre un usuario y un instructor,
 * en orden cronológico (como un chat).
 */
async function listarConversacion(idUsuario, idInstructor) {
  const mensajes = await repository.listarConversacion(idUsuario, idInstructor);
  return mensajes.map((m) => new Mensaje(m));
}

module.exports = {
  crearMensaje,
  listarConversacion,
};
