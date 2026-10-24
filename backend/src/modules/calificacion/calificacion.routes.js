const express = require('express');
const router = express.Router();
const controller = require('./calificacion.controller');
const { calificarValidator, manejarErroresValidacion } = require('./calificacion.validator');

const { verificarToken, autorizarRoles } = require('../../middlewares/auth.middleware');
const { participanteDeReserva } = require('../../middlewares/permisos.middleware');

// POST /api/calificacion/usuario -> el usuario de la reserva califica al instructor
router.post(
  '/usuario',
  verificarToken,
  autorizarRoles('usuario'),
  calificarValidator,
  manejarErroresValidacion,
  participanteDeReserva({ desde: 'body', campo: 'idReserva', como: 'usuario' }),
  controller.calificarComoUsuario
);

// POST /api/calificacion/instructor -> el instructor de la reserva califica al usuario
router.post(
  '/instructor',
  verificarToken,
  autorizarRoles('instructor'),
  calificarValidator,
  manejarErroresValidacion,
  participanteDeReserva({ desde: 'body', campo: 'idReserva', como: 'instructor' }),
  controller.calificarComoInstructor
);

// GET /api/calificacion/reserva/:idReserva -> solo quienes participan en la reserva
router.get(
  '/reserva/:idReserva',
  verificarToken,
  participanteDeReserva({ desde: 'params', campo: 'idReserva' }),
  controller.buscarPorReserva
);

module.exports = router;
