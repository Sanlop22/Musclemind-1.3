/**
 * Representa la forma de la entidad Disponibilidad.
 * No contiene lógica ni acceso a datos.
 */
class Disponibilidad {
  constructor({ id_disponibilidad, id_instructor, dia_semana, hora_inicio, hora_fin, estado }) {
    this.id_disponibilidad = id_disponibilidad;
    this.id_instructor = id_instructor;
    this.dia_semana = dia_semana;
    this.hora_inicio = hora_inicio;
    this.hora_fin = hora_fin;
    this.estado = estado;
  }
}

module.exports = Disponibilidad;
