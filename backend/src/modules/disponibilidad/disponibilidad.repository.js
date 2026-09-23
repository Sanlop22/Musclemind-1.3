const pool = require('../../database/connection');

async function crear({ idInstructor, diaSemana, horaInicio, horaFin }) {
  const [result] = await pool.query(
    `INSERT INTO disponibilidad (id_instructor, dia_semana, hora_inicio, hora_fin, estado)
     VALUES (?, ?, ?, ?, 'disponible')`,
    [idInstructor, diaSemana, horaInicio, horaFin]
  );
  return result.insertId;
}

async function buscarPorId(idDisponibilidad) {
  const [rows] = await pool.query(
    'SELECT * FROM disponibilidad WHERE id_disponibilidad = ?',
    [idDisponibilidad]
  );
  return rows[0] || null;
}

/**
 * Trae todos los bloques de un instructor en un día específico.
 * El Service usa esto para verificar solapamiento antes de crear
 * o actualizar un bloque — el Repository solo entrega los datos,
 * la comparación de rangos horarios la hace el Service.
 */
async function buscarPorInstructorYDia(idInstructor, diaSemana) {
  const [rows] = await pool.query(
    'SELECT * FROM disponibilidad WHERE id_instructor = ? AND dia_semana = ?',
    [idInstructor, diaSemana]
  );
  return rows;
}

/**
 * Lista todos los bloques de un instructor, sin filtrar por día.
 * Usado tanto para que el instructor vea su propia agenda completa,
 * como para que un usuario consulte la disponibilidad de un instructor.
 */
async function listarPorInstructor(idInstructor) {
  const [rows] = await pool.query(
    'SELECT * FROM disponibilidad WHERE id_instructor = ? ORDER BY dia_semana, hora_inicio',
    [idInstructor]
  );
  return rows;
}

async function actualizar(idDisponibilidad, { diaSemana, horaInicio, horaFin, estado }) {
  const [result] = await pool.query(
    `UPDATE disponibilidad
     SET dia_semana = ?, hora_inicio = ?, hora_fin = ?, estado = ?
     WHERE id_disponibilidad = ?`,
    [diaSemana, horaInicio, horaFin, estado, idDisponibilidad]
  );
  return result.affectedRows > 0;
}

async function eliminar(idDisponibilidad) {
  const [result] = await pool.query(
    'DELETE FROM disponibilidad WHERE id_disponibilidad = ?',
    [idDisponibilidad]
  );
  return result.affectedRows > 0;
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorInstructorYDia,
  listarPorInstructor,
  actualizar,
  eliminar,
};
