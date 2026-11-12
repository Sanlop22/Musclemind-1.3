
/**
 * Representa una fila de la tabla pago.
 */
class Pago {
  constructor({
    id_pago,
    id_reserva,
    id_usuario_pagador,
    monto,
    metodo_pago,
    estado,
    referencia_externa,
    fecha_pago
  }) {
    this.id_pago = id_pago;
    this.id_reserva = id_reserva;
    this.id_usuario_pagador = id_usuario_pagador;
    this.monto = monto;
    this.metodo_pago = metodo_pago;
    this.estado = estado;
    this.referencia_externa = referencia_externa;
    this.fecha_pago = fecha_pago;
  }
}

module.exports = Pago;
