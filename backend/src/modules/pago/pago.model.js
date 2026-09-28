/**
 * Representa una fila de la tabla `pago`. Cada reserva tiene, como
 * máximo, un único registro de pago (id_reserva es UNIQUE en la BD),
 * que se va actualizando conforme avanzan los intentos de pago.
 */
class Pago {
  constructor({
    id_pago,
    id_reserva,
    monto,
    metodo_pago,
    estado,
    referencia_externa,
    fecha_pago,
  }) {
    this.id_pago = id_pago;
    this.id_reserva = id_reserva;
    this.monto = monto;
    this.metodo_pago = metodo_pago;
    this.estado = estado;
    this.referencia_externa = referencia_externa;
    this.fecha_pago = fecha_pago;
  }
}

module.exports = Pago;
