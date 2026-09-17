const rutinaService = require('./rutina.service');

const getRutinas = async (req, res) => {
    try {
        // Permite filtrar por usuario: GET /api/rutinas?id_usuario=3
        const rutinas = await rutinaService.getRutinas(req.query.id_usuario);

        res.json(rutinas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRutinaById = async (req, res) => {
    try {
        const rutina = await rutinaService.getRutinaById(req.params.id);

        res.json(rutina);
    } catch (error) {
        const status = error.message === 'Rutina no encontrada' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const createRutina = async (req, res) => {
    try {
        const rutina = await rutinaService.createRutina(req.body);

        res.status(201).json(rutina);
    } catch (error) {
        const status = error.message === 'El usuario indicado no existe' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const updateRutina = async (req, res) => {
    try {
        const rutina = await rutinaService.updateRutina(req.params.id, req.body);

        res.json(rutina);
    } catch (error) {
        const status = error.message === 'Rutina no encontrada' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const deleteRutina = async (req, res) => {
    try {
        await rutinaService.deleteRutina(req.params.id);

        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getRutinas,
    getRutinaById,
    createRutina,
    updateRutina,
    deleteRutina
};
