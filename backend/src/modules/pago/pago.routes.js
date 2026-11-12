
const express = require('express');
const router = express.Router();

const controller = require('./pago.controller');

const {
  registrarPagoValidator,
  manejarErroresValidacion
} = require('./pago.validator');

const {
  verificarToken,
  autorizarRoles
} = require('../../middlewares/auth.middleware');

const {
  participanteDeReserva
} = require('../../middlewares/permisos.middleware');

// Procesar un pago simulado.
router.post(
  '/',
  verificarToken,
  autorizarRoles('usuario'),
  registrarPagoValidator,
  manejarErroresValidacion,
  participanteDeReserva({
    desde: 'body',
    campo: 'idReserva',
    como: 'usuario'
  }),
  controller.registrar
);

// Consultar el pago de una reserva.
router.get(
  '/reserva/:idReserva',
  verificarToken,
  participanteDeReserva({
    desde: 'params',
    campo: 'idReserva'
  }),
  controller.buscarPorReserva
);

module.exports = router;
