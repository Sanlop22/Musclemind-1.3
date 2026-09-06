const pool = require('../../database/connection');

class RutinaRepository {

    async getRutinas(id_usuario) {
        if (id_usuario) {
            const [rows] = await pool.query(
                'SELECT * FROM rutina WHERE id_usuario = ? ORDER BY fecha_creacion DESC',
                [id_usuario]
            );

            return rows;
        }

        const [rows] = await pool.query(
            'SELECT * FROM rutina ORDER BY fecha_creacion DESC'
        );

        return rows;
    }

    async getRutinaById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM rutina WHERE id_rutina = ?',
            [id]
        );

        return rows[0];
    }

    async createRutina(rutinaData) {
        const {
            id_usuario,
            nombre_rutina,
            descripcion,
            objetivo,
            nivel,
            dias_por_semana,
            duracion_minutos,
            estado
        } = rutinaData;

        const [result] = await pool.query(
            `INSERT INTO rutina
            (id_usuario, nombre_rutina, descripcion, objetivo, nivel, dias_por_semana, duracion_minutos, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                nombre_rutina,
                descripcion || null,
                objetivo || null,
                nivel,
                dias_por_semana || null,
                duracion_minutos || null,
                estado || 'activa'
            ]
        );

        return {
            id_rutina: result.insertId,
            ...rutinaData
        };
    }

    async updateRutina(id, rutinaData) {
        const {
            nombre_rutina,
            descripcion,
            objetivo,
            nivel,
            dias_por_semana,
            duracion_minutos,
            estado
        } = rutinaData;

        const [result] = await pool.query(
            `UPDATE rutina SET
                nombre_rutina = ?,
                descripcion = ?,
                objetivo = ?,
                nivel = ?,
                dias_por_semana = ?,
                duracion_minutos = ?,
                estado = ?
            WHERE id_rutina = ?`,
            [
                nombre_rutina,
                descripcion || null,
                objetivo || null,
                nivel,
                dias_por_semana || null,
                duracion_minutos || null,
                estado || 'activa',
                id
            ]
        );

        return result.affectedRows > 0;
    }

    async deleteRutina(id) {
        const [result] = await pool.query(
            'DELETE FROM rutina WHERE id_rutina = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = RutinaRepository;
