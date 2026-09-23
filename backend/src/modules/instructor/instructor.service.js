const bcrypt = require('bcryptjs');
const repository = require('./instructor.repository');
const Instructor = require('./instructor.model');

const SALT_ROUNDS = 10;

/**
 * Error de negocio: correo ya registrado.
 * Lleva su propio status para que errorHandler.middleware.js
 * responda 409 en vez del 500 genérico.
 */
class EmailYaExisteError extends Error {
  constructor(correo) {
    super(`Ya existe un instructor registrado con el correo ${correo}.`);
    this.status = 409;
  }
}

/**
 * Registra un nuevo instructor.
 * Nota que esta función recibe SOLO los campos que le interesan al negocio
 * (los desestructura explícitamente) — si el cliente envió campos extra
 * como id_instructor o password_hash en el body, aquí quedan ignorados
 * por diseño, nunca llegan al repository.
 */
async function crearInstructor({ nombre, apellido, experiencia, especialidad, correo, password }) {
  const existente = await repository.buscarPorCorreo(correo);
  if (existente) {
    throw new EmailYaExisteError(correo);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const idInstructor = await repository.crear({
    nombre,
    apellido,
    experiencia,
    especialidad,
    correo,
    passwordHash,
  });

  const instructorCreado = await repository.buscarPorId(idInstructor);
  return new Instructor(instructorCreado);
}

module.exports = { crearInstructor, EmailYaExisteError };
