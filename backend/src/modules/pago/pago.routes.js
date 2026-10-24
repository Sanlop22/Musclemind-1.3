const express = require('express');
const router = express.Router();
const controller = require('./pago.controller');
const {
  registrarPagoValidator,
  actualizarEstadoPagoValidator,
  manejarErroresValidacion,
} = require('./pago.validator');

const { verificarToken, autorizarRoles } = require('../../middlewares/auth.middleware');
const { participanteDeReserva } = require('../../middlewares/permisos.middleware');

// POST /api/pago -> registra (o reemplaza) el intento de pago de una reserva.
// Solo el usuario que hizo la reserva puede pagarla.
router.post(
  '/',
  verificarToken,
  autorizarRoles('usuario'),
  registrarPagoValidator,
  manejarErroresValidacion,
  participanteDeReserva({ desde: 'body', campo: 'idReserva', como: 'usuario' }),
  controller.registrar
);

// GET /api/pago/reserva/:idReserva -> solo quienes participan en la reserva
router.get(
  '/reserva/:idReserva',
  verificarToken,
  participanteDeReserva({ desde: 'params', campo: 'idReserva' }),
  controller.buscarPorReserva
);

// PATCH /api/pago/reserva/:idReserva/estado -> solo quienes participan en la reserva
router.patch(
  '/reserva/:idReserva/estado',
  verificarToken,
  actualizarEstadoPagoValidator,
  manejarErroresValidacion,
  participanteDeReserva({ desde: 'params', campo: 'idReserva' }),
  controller.actualizarEstado
);

module.exports = router;
