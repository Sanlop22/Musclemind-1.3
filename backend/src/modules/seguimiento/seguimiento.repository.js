
const pool = require('../../database/connection');

class SeguimientoRepository {

    // Obtener seguimientos con el nombre de la rutina realizada
    async getSeguimientos({ id_usuario, id_rutina } = {}) {
        const condiciones = [];
        const valores = [];

        if (id_usuario) {
            condiciones.push('s.id_usuario = ?');
            valores.push(id_usuario);
        }

        if (id_rutina) {
            condiciones.push('s.id_rutina = ?');
            valores.push(id_rutina);
        }

        const where = condiciones.length
            ? `WHERE ${condiciones.join(' AND ')}`
            : '';

        const [rows] = await pool.query(
            `SELECT
                s.*,
                r.nombre_rutina
             FROM seguimiento s
             LEFT JOIN rutina r ON s.id_rutina = r.id_rutina
             ${where}
             ORDER BY s.fecha DESC`,
            valores
        );

        return rows;
    }

    // Obtener un seguimiento por su ID
    async getSeguimientoById(id) {
        const [rows] = await pool.query(
            `SELECT
                s.*,
                r.nombre_rutina
             FROM seguimiento s
             LEFT JOIN rutina r ON s.id_rutina = r.id_rutina
             WHERE s.id_seguimiento = ?`,
            [id]
        );

        return rows[0];
    }

    // Crear un seguimiento
    async createSeguimiento(seguimientoData) {
        const {
            id_usuario,
            id_rutina,
            fecha,
            peso,
            comentarios
        } = seguimientoData;

        const [result] = await pool.query(
            `INSERT INTO seguimiento
            (id_usuario, id_rutina, fecha, peso, comentarios)
            VALUES (?, ?, ?, ?, ?)`,
            [
                id_usuario,
                id_rutina,
                fecha,
                peso || null,
                comentarios || null
            ]
        );

        return {
            id_seguimiento: result.insertId,
            ...seguimientoData
        };
    }

    // Actualizar un seguimiento
    async updateSeguimiento(id, seguimientoData) {
        const {
            id_rutina,
            fecha,
            peso,
            comentarios
        } = seguimientoData;

        const [result] = await pool.query(
            `UPDATE seguimiento SET
                id_rutina = ?,
                fecha = ?,
                peso = ?,
                comentarios = ?
            WHERE id_seguimiento = ?`,
            [
                id_rutina,
                fecha,
                peso || null,
                comentarios || null,
                id
            ]
        );

        return result.affectedRows > 0;
    }

    // Eliminar un seguimiento
    async deleteSeguimiento(id) {
        const [result] = await pool.query(
            'DELETE FROM seguimiento WHERE id_seguimiento = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = SeguimientoRepository;
