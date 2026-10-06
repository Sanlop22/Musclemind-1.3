const pool = require('../../database/connection');

/**
 * Inserta un nuevo instructor.
 */
async function crear({
    nombre,
    apellido,
    experiencia,
    especialidad,
    id_usuario
}) {
    const [result] = await pool.query(
        `INSERT INTO instructor
        (nombre, apellido, experiencia, especialidad, id_usuario)
        VALUES (?, ?, ?, ?, ?)`,
        [
            nombre,
            apellido,
            experiencia,
            especialidad,
            id_usuario
        ]
    );

    return result.insertId;
}

/**
 * Busca un instructor por ID.
 */
async function buscarPorId(idInstructor) {
    const [rows] = await pool.query(
        `SELECT
            id_instructor,
            nombre,
            apellido,
            experiencia,
            especialidad,
            id_usuario
         FROM instructor
         WHERE id_instructor = ?`,
        [idInstructor]
    );

    return rows[0] || null;
}
/**
 * Busca un instructor por correo.
 */
async function buscarPorCorreo(correo) {
    const [rows] = await pool.query(
        `SELECT
            id_instructor,
            nombre,
            apellido,
            experiencia,
            especialidad,
            id_usuario
         FROM instructor
         WHERE correo = ?`,
        [correo]
    );

    return rows[0] || null;
}

/**
 * Obtiene todos los instructores.
 */
async function listar() {
    const [rows] = await pool.query(
        `SELECT
            id_instructor,
            nombre,
            apellido,
            experiencia,
            especialidad,
            id_usuario
         FROM instructor`
    );

    return rows;
}

module.exports = {
    crear,
    buscarPorId,
    listar
};