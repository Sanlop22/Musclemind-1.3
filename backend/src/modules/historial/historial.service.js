const repository = require('./historial.repository');
const Historial = require('./historial.model');

/**
 * Crea un nuevo registro de historial para un usuario.
 * idUsuario llega directo en el body por ahora (el proyecto aún no
 * tiene JWT). Cuando se agregue autenticación, el único ajuste sería
 * tomarlo de req.user.id en el controller en vez del body.
 */
async function crearHistorial({ idUsuario, fecha, registroProgreso }) {
  const idHistorial = await repository.crear({ idUsuario, fecha, registroProgreso });
  const creado = await repository.buscarPorId(idHistorial);
  return new Historial(creado);
}

/**
 * Lista el historial completo de un usuario (su bitácora de progreso).
 */
async function listarPorUsuario(idUsuario) {
  const registros = await repository.listarPorUsuario(idUsuario);
  return registros.map((r) => new Historial(r));
}

module.exports = {
  crearHistorial,
  listarPorUsuario,
};
