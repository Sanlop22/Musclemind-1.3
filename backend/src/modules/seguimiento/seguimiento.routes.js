const express = require('express');

const router = express.Router();

const seguimientoController = require('./seguimiento.controller');
const seguimientoService = require('./seguimiento.service');

const { verificarToken } = require('../../middlewares/auth.middleware');
const { inyectarIdUsuario } = require('../../middlewares/permisos.middleware');

/**
 * Solo el dueño de un registro de seguimiento puede verlo, editarlo
 * o eliminarlo.
 */
const seguimientoPropio = async (req, res, next) => {
    try {
        const seguimiento = await seguimientoService.getSeguimientoById(req.params.id);

        if (Number(seguimiento.id_usuario) !== Number(req.user.id_usuario)) {
            return res.status(403).json({ error: 'Este registro de seguimiento no te pertenece.' });
        }

        next();
    } catch (error) {
        const status = error.message === 'Registro de seguimiento no encontrado' ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};

// Todas las rutas de seguimiento requieren sesión iniciada
router.use(verificarToken);

// Lista únicamente los seguimientos del usuario autenticado
router.get('/', seguimientoController.getSeguimientos);

router.get('/:id', seguimientoPropio, seguimientoController.getSeguimientoById);

// El seguimiento queda siempre a nombre del usuario autenticado
router.post('/', inyectarIdUsuario('id_usuario'), seguimientoController.createSeguimiento);

router.put('/:id', seguimientoPropio, seguimientoController.updateSeguimiento);

router.delete('/:id', seguimientoPropio, seguimientoController.deleteSeguimiento);

module.exports = router;
