const repository = require('./pago.repository');
const Pago = require('./pago.model');

/**
 * Error de negocio: se pidió el pago de una reserva que todavía no
 * tiene ningún intento de pago registrado.
 */
class PagoNoEncontradoError extends Error {
  constructor() {
    super('No existe un pago registrado para esa reserva.');
    this.status = 404;
  }
}

/**
 * Registra un intento de pago para una reserva.
 *
 * Decisión de diseño: en la tabla `pago`, id_reserva es UNIQUE, así que
 * solo puede existir UNA fila de pago por reserva. En vez de crear una
 * fila nueva por cada intento (lo que rompería esa restricción), este
 * método actúa como upsert: si la reserva ya tiene un registro de pago,
 * lo actualiza con los datos del nuevo intento (dejándolo en
 * "pendiente" otra vez); si no tiene ninguno, crea el primero.
 */
async function registrarPago({ idReserva, monto, metodoPago = 'otro' }) {
  const pagoExistente = await repository.buscarPorReserva(idReserva);

  if (pagoExistente) {
    await repository.actualizarIntento(idReserva, { monto, metodoPago });
  } else {
    await repository.crear({ idReserva, monto, metodoPago });
  }

  const actualizado = await repository.buscarPorReserva(idReserva);
  return new Pago(actualizado);
}

/**
 * Consulta el estado de pago de una reserva.
 */
async function buscarPorReserva(idReserva) {
  const pago = await repository.buscarPorReserva(idReserva);
  if (!pago) {
    throw new PagoNoEncontradoError();
  }
  return new Pago(pago);
}

/**
 * Cambia el estado de un pago (por ejemplo, cuando la pasarela de pago
 * confirma que el cobro fue exitoso, o cuando se marca como fallido o
 * reembolsado). Cuando el nuevo estado es "pagado", se registra la
 * fecha y hora exactas en fecha_pago.
 */
async function actualizarEstadoPago(idReserva, { estado, referenciaExterna = null }) {
  const pagoExistente = await repository.buscarPorReserva(idReserva);
  if (!pagoExistente) {
    throw new PagoNoEncontradoError();
  }

  const fechaPago = estado === 'pagado' ? new Date() : null;

  await repository.actualizarEstado(idReserva, { estado, referenciaExterna, fechaPago });
  const actualizado = await repository.buscarPorReserva(idReserva);
  return new Pago(actualizado);
}

module.exports = {
  registrarPago,
  buscarPorReserva,
  actualizarEstadoPago,
  PagoNoEncontradoError,
};
