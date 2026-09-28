/**
 * Representa una fila de la tabla `mensaje`: un mensaje enviado entre
 * un usuario y un instructor, indicando quién de los dos lo envió.
 */
class Mensaje {
  constructor({ id_mensaje, id_usuario, id_instructor, remitente, contenido, fecha }) {
    this.id_mensaje = id_mensaje;
    this.id_usuario = id_usuario;
    this.id_instructor = id_instructor;
    this.remitente = remitente;
    this.contenido = contenido;
    this.fecha = fecha;
  }
}

module.exports = Mensaje;
