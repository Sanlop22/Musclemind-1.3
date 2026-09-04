const pool = require('../../database/connection');

class UserRepository {

    async getUsers() {
        const [rows] = await pool.query(
            'SELECT * FROM usuario'
        );

        return rows;
    }

    async getUserById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE id_usuario = ?',
            [id]
        );

        return rows[0];
    }
     async getUserByDocument(numero_documento) {
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE numero_documento = ?',
            [numero_documento]
        );

        return rows[0];
    }

    async createUser(userData) {
        const {
            nombre,
            apellido,
            edad,
            tipo_documento,
            numero_documento,
            peso,
            altura,
            pais,
            correo,
            contrasena
        } = userData;

        const [result] = await pool.query(
            `INSERT INTO usuario
            (nombre, apellido, edad, tipo_documento, numero_documento, peso, altura, pais, correo, contrasena)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                edad,
                tipo_documento,
                numero_documento,
                peso,
                altura,
                pais,
                correo,
                contrasena
            ]
        );

        return {
            id_usuario: result.insertId,
            ...userData
        };
    }

    async updateUser(id, userData) {
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
    }

    async deleteUser(id) {
        const [result] = await pool.query(
            'DELETE FROM usuario WHERE id_usuario = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = UserRepository;