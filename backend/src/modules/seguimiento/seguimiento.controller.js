const seguimientoService = require('./seguimiento.service');

const getSeguimientos = async (req, res) => {
    try {
        // Permite filtrar: GET /api/seguimiento?id_usuario=3&id_rutina=2
        const seguimientos = await seguimientoService.getSeguimientos({
            id_usuario: req.query.id_usuario,
            id_rutina: req.query.id_rutina
        });

        res.json(seguimientos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSeguimientoById = async (req, res) => {
    try {
        const seguimiento = await seguimientoService.getSeguimientoById(req.params.id);

        res.json(seguimiento);
    } catch (error) {
        const status = error.message === 'Registro de seguimiento no encontrado' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const createSeguimiento = async (req, res) => {
    try {
        const seguimiento = await seguimientoService.createSeguimiento(req.body);

        res.status(201).json(seguimiento);
    } catch (error) {
        const noEncontrado = ['El usuario indicado no existe', 'La rutina indicada no existe'];
        const status = noEncontrado.includes(error.message) ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const updateSeguimiento = async (req, res) => {
    try {
        const seguimiento = await seguimientoService.updateSeguimiento(req.params.id, req.body);

        res.json(seguimiento);
    } catch (error) {
        const noEncontrado = ['Registro de seguimiento no encontrado', 'La rutina indicada no existe'];
        const status = noEncontrado.includes(error.message) ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const deleteSeguimiento = async (req, res) => {
    try {
        await seguimientoService.deleteSeguimiento(req.params.id);

        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getSeguimientos,
    getSeguimientoById,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento
};
