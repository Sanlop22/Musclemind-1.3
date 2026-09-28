const service = require('./historial.service');

/**
 * POST /api/historial
 * Crea un nuevo registro de progreso para un usuario.
 */
async function crear(req, res, next) {
  try {
    const { idUsuario, fecha, registroProgreso } = req.body;
    const nuevoHistorial = await service.crearHistorial({ idUsuario, fecha, registroProgreso });
    res.status(201).json(nuevoHistorial);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/historial/usuario/:idUsuario
 * Devuelve todo el historial de progreso de un usuario.
 */
async function listarPorUsuario(req, res, next) {
  try {
    const { idUsuario } = req.params;
    const registros = await service.listarPorUsuario(idUsuario);
    res.status(200).json(registros);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crear,
  listarPorUsuario,
};
