
const pool = require('../../database/connection');

/**
 * Inserta un nuevo mensaje.
 */
async function crear({ idUsuario, idInstructor, remitente, contenido }) {
  const [resultado] = await pool.query(
    `INSERT INTO mensaje
    (id_usuario, id_instructor, remitente, contenido, fecha)
    VALUES (?, ?, ?, ?, NOW())`,
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
 * Lista los mensajes de una conversación.
 */
async function listarConversacion(idUsuario, idInstructor) {
  const [filas] = await pool.query(
    `SELECT *
     FROM mensaje
     WHERE id_usuario = ? AND id_instructor = ?
     ORDER BY fecha ASC, id_mensaje ASC`,
    [idUsuario, idInstructor]
  );

  return filas;
}

/**
 * Lista las conversaciones de un instructor.
 */
async function listarConversacionesPorInstructor(idInstructor) {
  const [filas] = await pool.query(
    `SELECT
       m.id_usuario,
       u.nombre,
       u.apellido,
       m.contenido AS ultimo_mensaje,
       m.remitente AS ultimo_remitente,
       m.fecha AS fecha_ultimo_mensaje
     FROM mensaje m
     INNER JOIN usuario u ON u.id_usuario = m.id_usuario
     INNER JOIN (
       SELECT id_usuario, MAX(id_mensaje) AS ultimo_id
       FROM mensaje
       WHERE id_instructor = ?
       GROUP BY id_usuario
     ) ultimos ON ultimos.ultimo_id = m.id_mensaje
     ORDER BY m.id_mensaje DESC`,
    [idInstructor]
  );

  return filas;
}

/**
 * Lista las conversaciones de un deportista.
 */
async function listarConversacionesPorUsuario(idUsuario) {
  const [filas] = await pool.query(
    `SELECT
       m.id_instructor,
       i.nombre,
       i.apellido,
       m.contenido AS ultimo_mensaje,
       m.remitente AS ultimo_remitente,
       m.fecha AS fecha_ultimo_mensaje
     FROM mensaje m
     INNER JOIN instructor i
       ON i.id_instructor = m.id_instructor
     INNER JOIN (
       SELECT id_instructor, MAX(id_mensaje) AS ultimo_id
       FROM mensaje
       WHERE id_usuario = ?
       GROUP BY id_instructor
     ) ultimos ON ultimos.ultimo_id = m.id_mensaje
     ORDER BY m.id_mensaje DESC`,
    [idUsuario]
  );

  return filas;
}

module.exports = {
  crear,
  buscarPorId,
  listarConversacion,
  listarConversacionesPorInstructor,
  listarConversacionesPorUsuario
};
