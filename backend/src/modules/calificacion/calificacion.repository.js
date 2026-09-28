const pool = require('../../database/connection');

/**
 * Crea la fila de calificación de una reserva, dejando en null el lado
 * que todavía no se ha calificado (usuario→instructor o
 * instructor→usuario). Solo debe llamarse si esa reserva no tiene
 * fila de calificación aún (id_reserva es UNIQUE).
 */
async function crear({
  idReserva,
  puntuacionUsuarioAInstructor = null,
  comentarioUsuarioAInstructor = null,
  puntuacionInstructorAUsuario = null,
  comentarioInstructorAUsuario = null,
}) {
  const [resultado] = await pool.query(
    `INSERT INTO calificacion
      (id_reserva, puntuacion_usuario_a_instructor, comentario_usuario_a_instructor,
       puntuacion_instructor_a_usuario, comentario_instructor_a_usuario, fecha)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [
      idReserva,
      puntuacionUsuarioAInstructor,
      comentarioUsuarioAInstructor,
      puntuacionInstructorAUsuario,
      comentarioInstructorAUsuario,
    ]
  );
  return resultado.insertId;
}

/**
 * Busca una calificación por su id.
 */
async function buscarPorId(idCalificacion) {
  const [filas] = await pool.query(
    'SELECT * FROM calificacion WHERE id_calificacion = ?',
    [idCalificacion]
  );
  return filas[0];
}

/**
 * Busca la calificación asociada a una reserva (a lo sumo hay una,
 * porque id_reserva es UNIQUE en la tabla).
 */
async function buscarPorReserva(idReserva) {
  const [filas] = await pool.query(
    'SELECT * FROM calificacion WHERE id_reserva = ?',
    [idReserva]
  );
  return filas[0];
}

/**
 * Actualiza el lado "usuario califica al instructor" de una
 * calificación ya existente, sin tocar el otro lado.
 */
async function actualizarLadoUsuario(idReserva, { puntuacion, comentario }) {
  await pool.query(
    `UPDATE calificacion
     SET puntuacion_usuario_a_instructor = ?, comentario_usuario_a_instructor = ?
     WHERE id_reserva = ?`,
    [puntuacion, comentario, idReserva]
  );
}

/**
 * Actualiza el lado "instructor califica al usuario" de una
 * calificación ya existente, sin tocar el otro lado.
 */
async function actualizarLadoInstructor(idReserva, { puntuacion, comentario }) {
  await pool.query(
    `UPDATE calificacion
     SET puntuacion_instructor_a_usuario = ?, comentario_instructor_a_usuario = ?
     WHERE id_reserva = ?`,
    [puntuacion, comentario, idReserva]
  );
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorReserva,
  actualizarLadoUsuario,
  actualizarLadoInstructor,
};
