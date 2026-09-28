/**
 * Representa una fila de la tabla `historial`: un registro de progreso
 * que un usuario guarda en una fecha determinada.
 */
class Historial {
  constructor({ id_historial, id_usuario, fecha, registro_progreso }) {
    this.id_historial = id_historial;
    this.id_usuario = id_usuario;
    this.fecha = fecha;
    this.registro_progreso = registro_progreso;
  }
}

module.exports = Historial;
