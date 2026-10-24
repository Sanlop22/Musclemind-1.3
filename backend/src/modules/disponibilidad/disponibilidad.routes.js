const { Router } = require('express');
const controller = require('./disponibilidad.controller');
const {
  validarCrearDisponibilidad,
  validarActualizarDisponibilidad,
  validarIdParam,
  manejarErroresValidacion,
} = require('./disponibilidad.validator');

const { verificarToken, autorizarRoles } = require('../../middlewares/auth.middleware');
const { inyectarIdInstructor } = require('../../middlewares/permisos.middleware');
const disponibilidadService = require('./disponibilidad.service');

const router = Router();

/**
 * Solo el instructor dueño de un bloque puede modificarlo o eliminarlo.
 */
async function bloquePropio(req, res, next) {
  try {
    const bloque = await disponibilidadService.buscarPorId(req.params.id);

    if (Number(bloque.id_instructor) !== Number(req.user.id_instructor)) {
      return res.status(403).json({ error: 'Este bloque de disponibilidad no te pertenece.' });
    }

    next();
  } catch (error) {
    next(error);
  }
}

// POST /api/disponibilidad (el instructor sale del token, no del body)
router.post(
  '/',
  verificarToken,
  autorizarRoles('instructor'),
  inyectarIdInstructor('idInstructor'),
  validarCrearDisponibilidad,
  manejarErroresValidacion,
  controller.crear
);

// GET /api/disponibilidad/instructor/:idInstructor
// Cualquier usuario autenticado puede ver la agenda para reservar.
router.get('/instructor/:idInstructor', verificarToken, controller.listarPorInstructor);

// PUT /api/disponibilidad/:id
router.put(
  '/:id',
  verificarToken,
  autorizarRoles('instructor'),
  validarActualizarDisponibilidad,
  manejarErroresValidacion,
  bloquePropio,
  controller.actualizar
);

// DELETE /api/disponibilidad/:id
router.delete(
  '/:id',
  verificarToken,
  autorizarRoles('instructor'),
  validarIdParam,
  manejarErroresValidacion,
  bloquePropio,
  controller.eliminar
);

module.exports = router;
