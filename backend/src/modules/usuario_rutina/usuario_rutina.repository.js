const db = require('../../config/db');

class UsuarioRutinaRepository {

    async asignarRutina(id_usuario, id_rutina) {
        const [resultado] = await db.query(
            `INSERT INTO usuario_rutina
            (id_usuario, id_rutina)
            VALUES (?, ?)`,
            [id_usuario, id_rutina]
        );

        return {
            id_usuario_rutina: resultado.insertId,
            id_usuario,
            id_rutina
        };
    }

    async obtenerRutinasUsuario(id_usuario) {
        const [rutinas] = await db.query(
            `SELECT
                ur.id_usuario_rutina,
                ur.id_usuario,
                ur.id_rutina,
                ur.fecha_asignacion,
                r.nombre_rutina,
                r.descripcion,
                r.objetivo,
                r.nivel,
                r.dias_por_semana,
                r.duracion_minutos,
                r.estado
            FROM usuario_rutina ur
            INNER JOIN rutina r
                ON ur.id_rutina = r.id_rutina
            WHERE ur.id_usuario = ?`,
            [id_usuario]
        );

        return rutinas;
    }
}

module.exports = UsuarioRutinaRepository;