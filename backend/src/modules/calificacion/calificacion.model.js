/**
 * Representa una fila de la tabla `calificacion`. Cada reserva tiene,
 * como máximo, una única calificación (id_reserva es UNIQUE), con dos
 * lados independientes: lo que el usuario califica del instructor y
 * lo que el instructor califica del usuario.
 */
class Calificacion {
  constructor({
    id_calificacion,
    id_reserva,
    puntuacion_usuario_a_instructor,
    comentario_usuario_a_instructor,
    puntuacion_instructor_a_usuario,
    comentario_instructor_a_usuario,
    fecha,
  }) {
    this.id_calificacion = id_calificacion;
    this.id_reserva = id_reserva;
    this.puntuacion_usuario_a_instructor = puntuacion_usuario_a_instructor;
    this.comentario_usuario_a_instructor = comentario_usuario_a_instructor;
    this.puntuacion_instructor_a_usuario = puntuacion_instructor_a_usuario;
    this.comentario_instructor_a_usuario = comentario_instructor_a_usuario;
    this.fecha = fecha;
  }
}

module.exports = Calificacion;
