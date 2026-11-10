const express = require('express');

const router = express.Router();

const rutinaController = require('./rutina.controller');
const rutinaService = require('./rutina.service');

const { verificarToken } = require('../../middlewares/auth.middleware');

// Cargar una rutina y verificar los permisos
const cargarRutina = ({ soloDueno }) => async (req, res, next) => {
    try {
        const rutina = await rutinaService.getRutinaById(req.params.id);

        const esGeneral = rutina.id_instructor === null;
        const esDueno =
            Number(rutina.id_instructor) === Number(req.user.id_instructor);

        if (soloDueno ? !esDueno : !(esDueno || esGeneral)) {
            return res.status(403).json({
                error: 'No tienes permiso sobre esta rutina.'
            });
        }

        req.rutina = rutina;
        next();

    } catch (error) {
        const status =
            error.message === 'Rutina no encontrada' ? 404 : 500;

        res.status(status).json({ error: error.message });
    }
};

// Todas las rutas requieren sesión iniciada
router.use(verificarToken);

// Consultar todas las rutinas activas
router.get('/', rutinaController.getRutinas);

// Consultar una rutina por su ID
router.get(
    '/:id',
    cargarRutina({ soloDueno: false }),
    rutinaController.getRutinaById
);

// Crear una rutina
router.post('/', rutinaController.createRutina);

// Actualizar una rutina propia
router.put(
    '/:id',
    cargarRutina({ soloDueno: true }),
    rutinaController.updateRutina
);

// Eliminar una rutina propia
router.delete(
    '/:id',
    cargarRutina({ soloDueno: true }),
    rutinaController.deleteRutina
);

module.exports = router;