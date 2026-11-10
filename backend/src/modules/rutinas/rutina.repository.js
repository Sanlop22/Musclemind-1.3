const pool = require('../../database/connection');

class RutinaRepository {

    // Obtener todas las rutinas activas
    async getRutinas() {
        const [rows] = await pool.query(
            `SELECT * FROM rutina
             WHERE estado = 'activa'
             ORDER BY fecha_creacion DESC`
        );

        return rows;
    }

    // Obtener una rutina por su ID
    async getRutinaById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM rutina WHERE id_rutina = ?',
            [id]
        );

        return rows[0];
    }

    // Crear una rutina asociada a un instructor
    async createRutina(rutinaData) {
        const {
            id_instructor,
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
            (
                id_instructor,
                nombre_rutina,
                descripcion,
                objetivo,
                nivel,
                dias_por_semana,
                duracion_minutos,
                estado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_instructor || null,
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

    // Actualizar una rutina
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

    // Eliminar una rutina
    async deleteRutina(id) {
        const [result] = await pool.query(
            'DELETE FROM rutina WHERE id_rutina = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = RutinaRepository;