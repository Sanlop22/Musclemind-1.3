const express = require('express');
const router = express.Router();
const controller = require('./calificacion.controller');
const { calificarValidator, manejarErroresValidacion } = require('./calificacion.validator');

// POST /api/calificacion/usuario -> el usuario califica al instructor
router.post('/usuario', calificarValidator, manejarErroresValidacion, controller.calificarComoUsuario);

// POST /api/calificacion/instructor -> el instructor califica al usuario
router.post('/instructor', calificarValidator, manejarErroresValidacion, controller.calificarComoInstructor);

// GET /api/calificacion/reserva/:idReserva -> consulta la calificación de una reserva
router.get('/reserva/:idReserva', controller.buscarPorReserva);

module.exports = router;
