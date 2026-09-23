const { Router } = require('express');
const controller = require('./disponibilidad.controller');
const {
  validarCrearDisponibilidad,
  validarActualizarDisponibilidad,
  validarIdParam,
  manejarErroresValidacion,
} = require('./disponibilidad.validator');

const router = Router();

// POST /api/disponibilidad
router.post('/', validarCrearDisponibilidad, manejarErroresValidacion, controller.crear);

// GET /api/disponibilidad/instructor/:idInstructor
router.get('/instructor/:idInstructor', controller.listarPorInstructor);

// PUT /api/disponibilidad/:id
router.put('/:id', validarActualizarDisponibilidad, manejarErroresValidacion, controller.actualizar);

// DELETE /api/disponibilidad/:id
router.delete('/:id', validarIdParam, manejarErroresValidacion, controller.eliminar);

module.exports = router;
