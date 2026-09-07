/**
 * Representa la forma de la entidad Instructor.
 * No contiene lógica ni acceso a datos.
 * Deliberadamente NO incluye password_hash, para que ningún punto
 * del código exponga esa propiedad por accidente en una respuesta HTTP.
 */
class Instructor {
  constructor({ id_instructor, nombre, apellido, experiencia, especialidad, correo }) {
    this.id_instructor = id_instructor;
    this.nombre = nombre;
    this.apellido = apellido;
    this.experiencia = experiencia;
    this.especialidad = especialidad;
    this.correo = correo;
  }
}

module.exports = Instructor;
