
const rutinaService = require('./rutina.service');

// Obtener todas las rutinas disponibles
const getRutinas = async (req, res) => {
    try {
        const rutinas = await rutinaService.getRutinas();

        res.json(rutinas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una rutina por su ID
const getRutinaById = async (req, res) => {
    try {
        const rutina = await rutinaService.getRutinaById(req.params.id);

        res.json(rutina);
    } catch (error) {
        const status =
            error.message === 'Rutina no encontrada' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

// Crear una rutina
const createRutina = async (req, res) => {
    try {
        const rutinaData = {
            ...req.body,
            id_instructor: req.user.id_instructor
        };

        const rutina = await rutinaService.createRutina(rutinaData);

        res.status(201).json(rutina);
    } catch (error) {
        const status =
            error.message === 'El instructor indicado no existe' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

// Actualizar una rutina
const updateRutina = async (req, res) => {
    try {
        const rutina = await rutinaService.updateRutina(
            req.params.id,
            { ...req.rutina, ...req.body }
        );

        res.json(rutina);
    } catch (error) {
        const status =
            error.message === 'Rutina no encontrada' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

// Eliminar una rutina
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
