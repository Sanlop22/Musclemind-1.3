const pool = require('../../database/connection');

const getUsers = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM usuario'
    );

    return rows;
};

const getUserById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuario WHERE id_usuario = ?',
        [id]
    );

    return rows[0];
};

const createUser = async (userData) => {
    const {
        nombre,
        apellido,
        edad,
        tipo_documento,
        numero_documento,
        peso,
        altura,
        pais
    } = userData;

    const [result] = await pool.query(
        `INSERT INTO usuario
        (nombre, apellido, edad, tipo_documento, numero_documento, peso, altura, pais)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nombre,
            apellido,
            edad,
            tipo_documento,
            numero_documento,
            peso,
            altura,
            pais
        ]
    );

    return {
        id_usuario: result.insertId,
        ...userData
    };
};

const updateUser = async (id, userData) => {
    const {
        nombre,
        apellido,
        edad,
        tipo_documento,
        numero_documento,
        peso,
        altura,
        pais
    } = userData;

    const [result] = await pool.query(
        `UPDATE usuario SET
            nombre = ?,
            apellido = ?,
            edad = ?,
            tipo_documento = ?,
            numero_documento = ?,
            peso = ?,
            altura = ?,
            pais = ?
        WHERE id_usuario = ?`,
        [
            nombre,
            apellido,
            edad,
            tipo_documento,
            numero_documento,
            peso,
            altura,
            pais,
            id
        ]
    );

    return result.affectedRows > 0;
};

const deleteUser = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM usuario WHERE id_usuario = ?',
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};