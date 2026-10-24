const pool = require('../../database/connection');

/**
 * Quita el hash de la contraseña de una fila antes de sacarla de este
 * módulo. La contraseña (hash) solo debe viajar dentro del servidor, para
 * el login (getUserByEmail); nunca debe llegar a una respuesta HTTP.
 */
const sinContrasena = ({ contrasena, ...usuario }) => usuario;

class UserRepository {

    async getUsers() {
        const [rows] = await pool.query(
            'SELECT * FROM usuario'
        );

        return rows.map(sinContrasena);
    }

    async getUserById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE id_usuario = ?',
            [id]
        );

        return rows[0] ? sinContrasena(rows[0]) : undefined;
    }

    // Único método que devuelve el hash: lo necesita loginUser para
    // comparar la contraseña. No debe exponerse directamente en ninguna ruta.
    async getUserByEmail(correo) {
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE correo = ?',
            [correo]
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
            contrasena,
            rol
        } = userData;

        const [result] = await pool.query(
            `INSERT INTO usuario
            (
                nombre,
                apellido,
                edad,
                tipo_documento,
                numero_documento,
                peso,
                altura,
                pais,
                correo,
                contrasena,
                rol
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                contrasena,
                rol || "usuario"
            ]
        );

        return {
            id_usuario: result.insertId,
            nombre,
            apellido,
            edad,
            tipo_documento,
            numero_documento,
            peso,
            altura,
            pais,
            correo,
            rol: rol || 'usuario'
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