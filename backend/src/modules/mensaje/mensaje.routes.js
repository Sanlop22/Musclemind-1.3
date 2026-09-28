const express = require('express');
const router = express.Router();
const controller = require('./mensaje.controller');
const { crearMensajeValidator, manejarErroresValidacion } = require('./mensaje.validator');

// POST /api/mensaje -> envía un nuevo mensaje
router.post('/', crearMensajeValidator, manejarErroresValidacion, controller.crear);

// GET /api/mensaje/conversacion/:idUsuario/:idInstructor -> lista la conversación
router.get('/conversacion/:idUsuario/:idInstructor', controller.listarConversacion);

module.exports = router;
