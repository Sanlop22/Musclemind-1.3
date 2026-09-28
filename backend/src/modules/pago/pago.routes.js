const express = require('express');
const router = express.Router();
const controller = require('./pago.controller');
const {
  registrarPagoValidator,
  actualizarEstadoPagoValidator,
  manejarErroresValidacion,
} = require('./pago.validator');

// POST /api/pago -> registra (o reemplaza) el intento de pago de una reserva
router.post('/', registrarPagoValidator, manejarErroresValidacion, controller.registrar);

// GET /api/pago/reserva/:idReserva -> consulta el pago de una reserva
router.get('/reserva/:idReserva', controller.buscarPorReserva);

// PATCH /api/pago/reserva/:idReserva/estado -> cambia el estado del pago
router.patch(
  '/reserva/:idReserva/estado',
  actualizarEstadoPagoValidator,
  manejarErroresValidacion,
  controller.actualizarEstado
);

module.exports = router;
