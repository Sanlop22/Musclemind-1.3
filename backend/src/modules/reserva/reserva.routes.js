const { Router } = require('express');
const controller = require('./reserva.controller');
const {
  validarCrearReserva,
  validarCambioEstado,
  validarIdUsuarioParam,
  validarIdInstructorParam,
  manejarErroresValidacion,
} = require('./reserva.validator');

const router = Router();

// POST /api/reserva
router.post('/', validarCrearReserva, manejarErroresValidacion, controller.crear);

// GET /api/reserva/usuario/:idUsuario
router.get('/usuario/:idUsuario', validarIdUsuarioParam, manejarErroresValidacion, controller.listarPorUsuario);

// GET /api/reserva/instructor/:idInstructor
router.get('/instructor/:idInstructor', validarIdInstructorParam, manejarErroresValidacion, controller.listarPorInstructor);

// PATCH /api/reserva/:id/estado
router.patch('/:id/estado', validarCambioEstado, manejarErroresValidacion, controller.cambiarEstado);

module.exports = router;
