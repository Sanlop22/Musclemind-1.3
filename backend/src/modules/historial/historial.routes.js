const express = require('express');
const router = express.Router();
const controller = require('./historial.controller');
const { crearHistorialValidator, manejarErroresValidacion } = require('./historial.validator');

// POST /api/historial -> crea un nuevo registro de progreso
router.post('/', crearHistorialValidator, manejarErroresValidacion, controller.crear);

// GET /api/historial/usuario/:idUsuario -> lista el historial de un usuario
router.get('/usuario/:idUsuario', controller.listarPorUsuario);

module.exports = router;
