
const repository = require('./mensaje.repository');
const Mensaje = require('./mensaje.model');

// Crear un mensaje
async function crearMensaje(datos) {
  const idMensaje = await repository.crear(datos);
  const mensaje = await repository.buscarPorId(idMensaje);

  return new Mensaje(mensaje);
}

// Consultar los mensajes de una conversación
async function listarConversacion(idUsuario, idInstructor) {
  const mensajes = await repository.listarConversacion(
    idUsuario,
    idInstructor
  );

  return mensajes.map((mensaje) => new Mensaje(mensaje));
}

// Consultar conversaciones de un instructor
async function listarConversacionesPorInstructor(idInstructor) {
  return repository.listarConversacionesPorInstructor(idInstructor);
}

// Consultar conversaciones de un deportista
async function listarConversacionesPorUsuario(idUsuario) {
  return repository.listarConversacionesPorUsuario(idUsuario);
}

module.exports = {
  crearMensaje,
  listarConversacion,
  listarConversacionesPorInstructor,
  listarConversacionesPorUsuario
};
