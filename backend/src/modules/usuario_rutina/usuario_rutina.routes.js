const express = require('express');

const router = express.Router();

const usuarioRutinaController = require('./usuario_rutina.controller');

router.post('/', usuarioRutinaController.asignarRutina);

router.get('/:id_usuario', usuarioRutinaController.obtenerRutinasUsuario);

module.exports = router;