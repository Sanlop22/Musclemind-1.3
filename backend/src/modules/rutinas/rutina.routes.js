const express = require('express');

const router = express.Router();

const rutinaController = require('./rutina.controller');
const rutinaService = require('./rutina.service');

const { verificarToken } = require('../../middlewares/auth.middleware');
const { inyectarIdUsuario } = require('../../middlewares/permisos.middleware');

/**
 * Carga la rutina de la URL y deja el resultado en req.rutina.
 * Con soloDueno=true exige además que la rutina sea del usuario
 * autenticado. Las rutinas generales (id_usuario nulo) las puede
 * consultar cualquiera, pero no modificarlas ni eliminarlas.
 */
const cargarRutina = ({ soloDueno }) => async (req, res, next) => {
    try {
        const rutina = await rutinaService.getRutinaById(req.params.id);

        const esGeneral = rutina.id_usuario === null || rutina.id_usuario === undefined;
        const esDueno = Number(rutina.id_usuario) === Number(req.user.id_usuario);

        if (soloDueno ? !esDueno : !(esDueno || esGeneral)) {
            return res.status(403).json({ error: 'No tienes permiso sobre esta rutina.' });
        }

        req.rutina = rutina;
        next();
    } catch (error) {
        const status = error.message === 'Rutina no encontrada' ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};

// Todas las rutas de rutinas requieren sesión iniciada
router.use(verificarToken);

// Lista las rutinas propias y las rutinas generales
router.get('/', rutinaController.getRutinas);

router.get('/:id', cargarRutina({ soloDueno: false }), rutinaController.getRutinaById);

// La rutina queda siempre a nombre del usuario autenticado
router.post('/', inyectarIdUsuario('id_usuario'), rutinaController.createRutina);

router.put('/:id', cargarRutina({ soloDueno: true }), rutinaController.updateRutina);

router.delete('/:id', cargarRutina({ soloDueno: true }), rutinaController.deleteRutina);

module.exports = router;
