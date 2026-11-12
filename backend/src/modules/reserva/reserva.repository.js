
const pool = require('../../database/connection');

async function bloquearInstructor(idInstructor, conexion) {
  const [rows] = await conexion.query(
    `SELECT id_instructor
     FROM instructor
     WHERE id_instructor = ?
     FOR UPDATE`,
    [idInstructor]
  );

  return rows[0] || null;
}

async function crear(datos, conexion = pool) {
  const {
    idUsuario,
    idInstructor,
    idRutina,
    objetivo,
    fecha,
    horaInicio,
    horaFin,
    precio
  } = datos;

  const [result] = await conexion.query(
    `INSERT INTO reserva
     (id_usuario, id_instructor, id_rutina, objetivo,
      fecha, hora_inicio, hora_fin, estado, precio)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
    [
      idUsuario,
      idInstructor,
      idRutina,
      objetivo,
      fecha,
      horaInicio,
      horaFin,
      precio
    ]
  );

  return result.insertId;
}

async function buscarPorId(idReserva, conexion = pool) {
  const [rows] = await conexion.query(
    'SELECT * FROM reserva WHERE id_reserva = ?',
    [idReserva]
  );

  return rows[0] || null;
}

// Lista las reservas del usuario e indica si ya fueron calificadas.
async function listarPorUsuario(idUsuario) {
  const [rows] = await pool.query(
    `SELECT
        r.*,
        CASE
          WHEN c.puntuacion_usuario_a_instructor IS NOT NULL THEN 1
          ELSE 0
        END AS calificada
     FROM reserva r
     LEFT JOIN calificacion c
       ON c.id_reserva = r.id_reserva
     WHERE r.id_usuario = ?
     ORDER BY r.fecha DESC, r.hora_inicio DESC`,
    [idUsuario]
  );

  return rows;
}

// Lista las reservas del instructor con información del deportista y del pago.
async function listarPorInstructor(idInstructor) {
  const [rows] = await pool.query(
    `SELECT
        r.*,

        u.nombre AS nombre_deportista,
        u.apellido AS apellido_deportista,
        CONCAT(u.nombre, ' ', u.apellido) AS deportista,

        p.estado AS estado_pago,

        up.nombre AS nombre_pagador,
        up.apellido AS apellido_pagador,
        CONCAT(up.nombre, ' ', up.apellido) AS pagador

     FROM reserva r

     INNER JOIN usuario u
       ON r.id_usuario = u.id_usuario

     LEFT JOIN pago p
       ON r.id_reserva = p.id_reserva

     LEFT JOIN usuario up
       ON p.id_usuario_pagador = up.id_usuario

     WHERE r.id_instructor = ?

     ORDER BY r.fecha DESC, r.hora_inicio DESC`,
    [idInstructor]
  );

  return rows;
}

async function buscarPorInstructorYFecha(
  idInstructor,
  fecha,
  conexion = pool
) {
  const [rows] = await conexion.query(
    `SELECT * FROM reserva
     WHERE id_instructor = ?
     AND fecha = ?
     AND estado != 'cancelada'`,
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
  bloquearInstructor,
  crear,
  buscarPorId,
  listarPorUsuario,
  listarPorInstructor,
  buscarPorInstructorYFecha,
  actualizarEstado
};

