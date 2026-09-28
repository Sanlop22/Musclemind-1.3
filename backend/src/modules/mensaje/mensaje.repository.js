const pool = require('../../database/connection');

/**
 * Inserta un nuevo mensaje. `fecha` se genera en el momento de la
 * inserción usando NOW() de MySQL, así el Service no necesita
 * preocuparse por la hora del servidor.
 */
async function crear({ idUsuario, idInstructor, remitente, contenido }) {
  const [resultado] = await pool.query(
    'INSERT INTO mensaje (id_usuario, id_instructor, remitente, contenido, fecha) VALUES (?, ?, ?, ?, NOW())',
    [idUsuario, idInstructor, remitente, contenido]
  );
  return resultado.insertId;
}

/**
 * Busca un mensaje por su id.
 */
async function buscarPorId(idMensaje) {
  const [filas] = await pool.query(
    'SELECT * FROM mensaje WHERE id_mensaje = ?',
    [idMensaje]
  );
  return filas[0];
}

/**
 * Lista la conversación completa entre un usuario y un instructor
 * específicos, ordenada del mensaje más antiguo al más reciente
 * (orden natural de lectura de un chat).
 */
async function listarConversacion(idUsuario, idInstructor) {
  const [filas] = await pool.query(
    'SELECT * FROM mensaje WHERE id_usuario = ? AND id_instructor = ? ORDER BY fecha ASC',
    [idUsuario, idInstructor]
  );
  return filas;
}

module.exports = {
  crear,
  buscarPorId,
  listarConversacion,
};
