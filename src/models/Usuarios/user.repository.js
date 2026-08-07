const pool = require("../../database/connection");

const getUsers = async () => {
    const [rows] = await pool.query("SELECT * FROM usuario");

    return rows;
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

module.exports = {
    getUsers,
    createUser
};