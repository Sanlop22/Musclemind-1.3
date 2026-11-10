
/**
 * Representa la forma de la entidad Reserva.
 * No contiene lógica ni acceso a datos.
 */
class Reserva {
  constructor({
    id_reserva,
    id_usuario,
    id_instructor,
    id_rutina,
    objetivo,
    fecha,
    hora_inicio,
    hora_fin,
    estado,
    precio,
    calificada,
    estado_pago
  }) {
    this.id_reserva = id_reserva;
    this.id_usuario = id_usuario;
    this.id_instructor = id_instructor;
    this.id_rutina = id_rutina;
    this.objetivo = objetivo;
    this.fecha = fecha;
    this.hora_inicio = hora_inicio;
    this.hora_fin = hora_fin;
    this.estado = estado;
    this.precio = precio;
    this.calificada = calificada;
    this.estado_pago = estado_pago;
  }
}

module.exports = Reserva;
