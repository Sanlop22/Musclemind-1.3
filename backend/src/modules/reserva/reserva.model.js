
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
    estado_pago,
    nombre_deportista,
    apellido_deportista,
    deportista,
    nombre_pagador,
    apellido_pagador,
    pagador
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

    this.nombre_deportista = nombre_deportista;
    this.apellido_deportista = apellido_deportista;
    this.deportista = deportista;

    this.nombre_pagador = nombre_pagador;
    this.apellido_pagador = apellido_pagador;
    this.pagador = pagador;
  }
}

module.exports = Reserva;
