
const repository = require('./pago.repository');
const Pago = require('./pago.model');
const pool = require('../../database/connection');

class PagoNoEncontradoError extends Error {
  constructor() {
    super('No existe un pago registrado para esa reserva.');
    this.status = 404;
  }
}

class PagoYaProcesadoError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.status = 409;
  }
}

/**
 * Procesa un pago simulado con una transacción.
 */
async function procesarPagoSimulado({
  idReserva,
  idUsuarioPagador,
  monto,
  metodoPago = 'tarjeta'
}) {
  const conexion = await pool.getConnection();
  let transaccionIniciada = false;

  try {
    await conexion.beginTransaction();
    transaccionIniciada = true;

    // Bloquea la reserva para evitar dos procesos simultáneos.
    const [reservas] = await conexion.query(
      `SELECT id_reserva
       FROM reserva
       WHERE id_reserva = ?
       FOR UPDATE`,
      [idReserva]
    );

    if (reservas.length === 0) {
      throw new PagoNoEncontradoError();
    }

    let pago = await repository.buscarPorReserva(
      idReserva,
      conexion
    );

    if (pago?.estado === 'pagado') {
      throw new PagoYaProcesadoError(
        'Esta reserva ya fue pagada. No se puede realizar otro cobro.'
      );
    }

    if (pago?.estado === 'reembolsado') {
      throw new PagoYaProcesadoError(
        'Esta reserva tiene un pago reembolsado y no puede procesarse nuevamente.'
      );
    }

    if (!pago) {
      await repository.crear(
        {
          idReserva,
          idUsuarioPagador,
          monto,
          metodoPago
        },
        conexion
      );
    } else if (pago.estado === 'fallido') {
      await repository.actualizarIntento(
        idReserva,
        {
          idUsuarioPagador,
          monto,
          metodoPago
        },
        conexion
      );
    }

    const referenciaExterna =
      `MM-${String(idReserva).padStart(5, '0')}`;

    const filasActualizadas = await repository.aprobarPago(
      idReserva,
      {
        referenciaExterna,
        fechaPago: new Date()
      },
      conexion
    );

    if (filasActualizadas !== 1) {
      throw new PagoYaProcesadoError(
        'No fue posible aprobar el pago porque su estado cambió.'
      );
    }

    const pagoActualizado = await repository.buscarPorReserva(
      idReserva,
      conexion
    );

    await conexion.commit();
    transaccionIniciada = false;

    return new Pago(pagoActualizado);

  } catch (error) {
    if (transaccionIniciada) {
      await conexion.rollback();
    }

    throw error;

  } finally {
    conexion.release();
  }
}

/**
 * Consulta el pago asociado a una reserva.
 */
async function buscarPorReserva(idReserva) {
  const pago = await repository.buscarPorReserva(idReserva);

  if (!pago) {
    throw new PagoNoEncontradoError();
  }

  return new Pago(pago);
}

module.exports = {
  procesarPagoSimulado,
  buscarPorReserva,
  PagoNoEncontradoError,
  PagoYaProcesadoError
};

