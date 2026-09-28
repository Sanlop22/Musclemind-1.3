const service = require('./pago.service');

/**
 * POST /api/pago
 * Registra un nuevo intento de pago para una reserva. Si la reserva ya
 * tenía un intento previo, este lo reemplaza (por la restricción UNIQUE
 * de id_reserva en la base de datos).
 */
async function registrar(req, res, next) {
  try {
    const { idReserva, monto, metodoPago } = req.body;
    const pago = await service.registrarPago({ idReserva, monto, metodoPago });
    res.status(201).json(pago);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/pago/reserva/:idReserva
 * Consulta el estado de pago de una reserva.
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

/**
 * PATCH /api/pago/reserva/:idReserva/estado
 * Actualiza el estado del pago de una reserva (pagado, fallido, reembolsado).
 */
async function actualizarEstado(req, res, next) {
  try {
    const { idReserva } = req.params;
    const { estado, referenciaExterna } = req.body;
    const pago = await service.actualizarEstadoPago(idReserva, { estado, referenciaExterna });
    res.status(200).json(pago);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registrar,
  buscarPorReserva,
  actualizarEstado,
};
