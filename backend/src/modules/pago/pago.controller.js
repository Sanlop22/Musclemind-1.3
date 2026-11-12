
const service = require('./pago.service');

/**
 * POST /api/pago
 * Procesa un pago simulado.
 */
async function registrar(req, res, next) {
  try {
    const idReserva = req.reserva.id_reserva;
    const idUsuarioPagador = req.user.id_usuario;
    const monto = Number(req.reserva.precio);
    const { metodoPago = 'tarjeta' } = req.body;

    if (!Number.isFinite(monto) || monto <= 0) {
      return res.status(400).json({
        mensaje: 'La reserva no tiene un precio válido.'
      });
    }

    const pago = await service.procesarPagoSimulado({
      idReserva,
      idUsuarioPagador,
      monto,
      metodoPago
    });

    res.status(200).json(pago);

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/pago/reserva/:idReserva
 */
async function buscarPorReserva(req, res, next) {
  try {
    const { idReserva } = req.params;

    const pago = await service.buscarPorReserva(idReserva);

    res.status(200).json(pago);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  registrar,
  buscarPorReserva
};

