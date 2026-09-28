// Única capa que toca SQL directamente. Usa siempre consultas preparadas
// (parámetros con "?") para evitar inyección SQL.
const pool = require('../../database/connection');

/**
 * Inserta un nuevo registro de historial y devuelve el id generado.
 */
async function crear({ idUsuario, fecha, registroProgreso }) {
  const [resultado] = await pool.query(
    'INSERT INTO historial (id_usuario, fecha, registro_progreso) VALUES (?, ?, ?)',
    [idUsuario, fecha, registroProgreso]
  );
  return resultado.insertId;
}

/**
 * Busca un registro de historial por su id.
 */
async function buscarPorId(idHistorial) {
  const [filas] = await pool.query(
    'SELECT * FROM historial WHERE id_historial = ?',
    [idHistorial]
  );
  return filas[0];
}

/**
 * Lista todos los registros de historial de un usuario, del más
 * reciente al más antiguo.
 */
async function listarPorUsuario(idUsuario) {
  const [filas] = await pool.query(
    'SELECT * FROM historial WHERE id_usuario = ? ORDER BY fecha DESC',
    [idUsuario]
  );
  return filas;
}

module.exports = {
  crear,
  buscarPorId,
  listarPorUsuario,
};
