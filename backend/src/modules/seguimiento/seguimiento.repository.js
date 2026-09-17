const pool = require('../../database/connection');

class SeguimientoRepository {

    async getSeguimientos({ id_usuario, id_rutina } = {}) {
        const condiciones = [];
        const valores = [];

        if (id_usuario) {
            condiciones.push('id_usuario = ?');
            valores.push(id_usuario);
        }

        if (id_rutina) {
            condiciones.push('id_rutina = ?');
            valores.push(id_rutina);
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const [rows] = await pool.query(
            `SELECT * FROM seguimiento ${where} ORDER BY fecha DESC`,
            valores
        );

        return rows;
    }

    async getSeguimientoById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM seguimiento WHERE id_seguimiento = ?',
            [id]
        );

        return rows[0];
    }

    async createSeguimiento(seguimientoData) {
        const {
            id_usuario,
            id_rutina,
            fecha,
            peso,
            porcentaje_grasa,
            masa_muscular,
            series_completadas,
            repeticiones_completadas,
            nivel_esfuerzo,
            comentarios
        } = seguimientoData;

        const [result] = await pool.query(
            `INSERT INTO seguimiento
            (id_usuario, id_rutina, fecha, peso, porcentaje_grasa, masa_muscular, series_completadas, repeticiones_completadas, nivel_esfuerzo, comentarios)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                id_rutina || null,
                fecha,
                peso || null,
                porcentaje_grasa || null,
                masa_muscular || null,
                series_completadas || null,
                repeticiones_completadas || null,
                nivel_esfuerzo || null,
                comentarios || null
            ]
        );

        return {
            id_seguimiento: result.insertId,
            ...seguimientoData
        };
    }

    async updateSeguimiento(id, seguimientoData) {
        const {
            id_rutina,
            fecha,
            peso,
            porcentaje_grasa,
            masa_muscular,
            series_completadas,
            repeticiones_completadas,
            nivel_esfuerzo,
            comentarios
        } = seguimientoData;

        const [result] = await pool.query(
            `UPDATE seguimiento SET
                id_rutina = ?,
                fecha = ?,
                peso = ?,
                porcentaje_grasa = ?,
                masa_muscular = ?,
                series_completadas = ?,
                repeticiones_completadas = ?,
                nivel_esfuerzo = ?,
                comentarios = ?
            WHERE id_seguimiento = ?`,
            [
                id_rutina || null,
                fecha,
                peso || null,
                porcentaje_grasa || null,
                masa_muscular || null,
                series_completadas || null,
                repeticiones_completadas || null,
                nivel_esfuerzo || null,
                comentarios || null,
                id
            ]
        );

        return result.affectedRows > 0;
    }

    async deleteSeguimiento(id) {
        const [result] = await pool.query(
            'DELETE FROM seguimiento WHERE id_seguimiento = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = SeguimientoRepository;
