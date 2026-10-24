const express = require('express');
const router = express.Router();
const controller = require('./historial.controller');
const { crearHistorialValidator, manejarErroresValidacion } = require('./historial.validator');

const { verificarToken, autorizarRoles } = require('../../middlewares/auth.middleware');
const { soloMismoUsuario, inyectarIdUsuario } = require('../../middlewares/permisos.middleware');

// POST /api/historial -> crea un registro para el usuario autenticado
// (idUsuario sale del token, se ignora el que venga en el body)
router.post(
  '/',
  verificarToken,
  autorizarRoles('usuario'),
  inyectarIdUsuario('idUsuario'),
  crearHistorialValidator,
  manejarErroresValidacion,
  controller.crear
);

// GET /api/historial/usuario/:idUsuario -> solo el historial propio
router.get(
  '/usuario/:idUsuario',
  verificarToken,
  soloMismoUsuario('idUsuario'),
  controller.listarPorUsuario
);

module.exports = router;
