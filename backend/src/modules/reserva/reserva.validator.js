const { body, param, validationResult } = require('express-validator');

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'];
const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

const validarCrearReserva = [
  body('idUsuario')
    .notEmpty().withMessage('El id del usuario es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id del usuario debe ser un número entero válido.'),

  body('idInstructor')
    .notEmpty().withMessage('El id del instructor es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id del instructor debe ser un número entero válido.'),

  body('idRutina')
    .notEmpty().withMessage('El id de la rutina es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id de la rutina debe ser un número entero válido.'),

  body('objetivo')
    .optional({ checkFalsy: true })
    .isLength({ max: 255 }).withMessage('El objetivo no puede superar los 255 caracteres.'),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD.'),

  body('horaInicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria.')
    .matches(HORA_REGEX).withMessage('La hora de inicio debe tener formato HH:MM (24 horas).'),

  body('horaFin')
    .notEmpty().withMessage('La hora de fin es obligatoria.')
    .matches(HORA_REGEX).withMessage('La hora de fin debe tener formato HH:MM (24 horas).'),

  body('precio')
    .notEmpty().withMessage('El precio es obligatorio.')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0.'),
];

const validarCambioEstado = [
  param('id').isInt({ min: 1 }).withMessage('El id de la reserva en la URL no es válido.'),

  body('estado')
    .notEmpty().withMessage('El estado es obligatorio.')
    .isIn(ESTADOS_VALIDOS).withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`),
];

const validarIdUsuarioParam = [
  param('idUsuario').isInt({ min: 1 }).withMessage('El id de usuario en la URL no es válido.'),
];

const validarIdInstructorParam = [
  param('idInstructor').isInt({ min: 1 }).withMessage('El id de instructor en la URL no es válido.'),
];

function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = {
  validarCrearReserva,
  validarCambioEstado,
  validarIdUsuarioParam,
  validarIdInstructorParam,
  manejarErroresValidacion,
};
