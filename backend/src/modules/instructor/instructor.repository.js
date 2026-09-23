const pool = require('../../database/connection');

/**
 * Inserta un nuevo instructor. Recibe los datos ya validados
 * y la contraseña ya hasheada — este archivo no valida ni transforma nada.
 */
async function crear({ nombre, apellido, experiencia, especialidad, correo, passwordHash }) {
  const [result] = await pool.query(
    `INSERT INTO instructor (nombre, apellido, experiencia, especialidad, correo, password_hash)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, experiencia, especialidad, correo, passwordHash]
  );
  return result.insertId;
}

/**
 * Busca un instructor por correo, incluyendo password_hash.
 * Lo usa el Service para verificar unicidad (registro) y para login.
 */
async function buscarPorCorreo(correo) {
  const [rows] = await pool.query(
    'SELECT * FROM instructor WHERE correo = ?',
    [correo]
  );
  return rows[0] || null;
}

/**
 * Busca un instructor por ID, EXCLUYENDO password_hash a propósito,
 * porque este resultado suele viajar directo a una respuesta HTTP.
 */
async function buscarPorId(idInstructor) {
  const [rows] = await pool.query(
    `SELECT id_instructor, nombre, apellido, experiencia, especialidad, correo
     FROM instructor WHERE id_instructor = ?`,
    [idInstructor]
  );
  return rows[0] || null;
}

module.exports = {
  crear,
  buscarPorCorreo,
  buscarPorId,
};
