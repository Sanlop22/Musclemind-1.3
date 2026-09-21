const pool = require('../../database/connection');

async function crear({ idUsuario, idInstructor, idRutina, objetivo, fecha, horaInicio, horaFin, precio }) {
  const [result] = await pool.query(
    `INSERT INTO reserva (id_usuario, id_instructor, id_rutina, objetivo, fecha, hora_inicio, hora_fin, estado, precio)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
    [idUsuario, idInstructor, idRutina, objetivo, fecha, horaInicio, horaFin, precio]
  );
  return result.insertId;
}

async function buscarPorId(idReserva) {
  const [rows] = await pool.query('SELECT * FROM reserva WHERE id_reserva = ?', [idReserva]);
  return rows[0] || null;
}

async function listarPorUsuario(idUsuario) {
  const [rows] = await pool.query(
    'SELECT * FROM reserva WHERE id_usuario = ? ORDER BY fecha DESC, hora_inicio DESC',
    [idUsuario]
  );
  return rows;
}

async function listarPorInstructor(idInstructor) {
  const [rows] = await pool.query(
    'SELECT * FROM reserva WHERE id_instructor = ? ORDER BY fecha DESC, hora_inicio DESC',
    [idInstructor]
  );
  return rows;
}

/**
 * Trae las reservas activas (no canceladas) de un instructor en una
 * fecha específica. El Service usa esto para verificar solapamiento
 * antes de crear una reserva nueva.
 */
async function buscarPorInstructorYFecha(idInstructor, fecha) {
  const [rows] = await pool.query(
    `SELECT * FROM reserva
     WHERE id_instructor = ? AND fecha = ? AND estado != 'cancelada'`,
    [idInstructor, fecha]
  );
  return rows;
}

async function actualizarEstado(idReserva, nuevoEstado) {
  const [result] = await pool.query(
    'UPDATE reserva SET estado = ? WHERE id_reserva = ?',
    [nuevoEstado, idReserva]
  );
  return result.affectedRows > 0;
}

module.exports = {
  crear,
  buscarPorId,
  listarPorUsuario,
  listarPorInstructor,
  buscarPorInstructorYFecha,
  actualizarEstado,
};
