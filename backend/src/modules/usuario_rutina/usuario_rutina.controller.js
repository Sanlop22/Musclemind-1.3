const usuarioRutinaService = require('./usuario_rutina.service');

const asignarRutina = async (req, res) => {
    try {
        const { id_usuario, id_rutina } = req.body;

        if (!id_usuario || !id_rutina) {
            return res.status(400).json({
                error: 'id_usuario e id_rutina son obligatorios'
            });
        }

        const resultado = await usuarioRutinaService.asignarRutina(
            id_usuario,
            id_rutina
        );

        res.status(201).json({
            mensaje: 'Rutina asignada correctamente',
            datos: resultado
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const obtenerRutinasUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const rutinas = await usuarioRutinaService.obtenerRutinasUsuario(
            id_usuario
        );

        res.json(rutinas);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    asignarRutina,
    obtenerRutinasUsuario
};