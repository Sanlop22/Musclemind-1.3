const { Router } = require('express');
const controller = require('./instructor.controller');
const { validarCrearInstructor, manejarErroresValidacion } = require('./instructor.validator');

const router = Router();

// POST /api/instructor
router.post('/', validarCrearInstructor, manejarErroresValidacion, controller.crear);

module.exports = router;
