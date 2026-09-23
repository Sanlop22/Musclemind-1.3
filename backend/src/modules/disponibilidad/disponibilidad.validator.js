const { body, param, validationResult } = require('express-validator');

const DIAS_VALIDOS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

/**
 * Reglas de VALIDACIÓN DE FORMA únicamente. No consultan la base de datos
 * (eso, incluyendo la regla de solapamiento, vive en el Service).
 */
const validarCrearDisponibilidad = [
  body('idInstructor')
    .notEmpty().withMessage('El id del instructor es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id del instructor debe ser un número entero válido.'),

  body('diaSemana')
    .notEmpty().withMessage('El día de la semana es obligatorio.')
    .isIn(DIAS_VALIDOS).withMessage(`El día debe ser uno de: ${DIAS_VALIDOS.join(', ')}.`),

  body('horaInicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de inicio debe tener formato HH:MM (24 horas).'),

  body('horaFin')
    .notEmpty().withMessage('La hora de fin es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de fin debe tener formato HH:MM (24 horas).'),
];

const validarActualizarDisponibilidad = [
  param('id')
    .isInt({ min: 1 }).withMessage('El id de disponibilidad en la URL no es válido.'),

  body('diaSemana')
    .notEmpty().withMessage('El día de la semana es obligatorio.')
    .isIn(DIAS_VALIDOS).withMessage(`El día debe ser uno de: ${DIAS_VALIDOS.join(', ')}.`),

  body('horaInicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de inicio debe tener formato HH:MM (24 horas).'),

  body('horaFin')
    .notEmpty().withMessage('La hora de fin es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de fin debe tener formato HH:MM (24 horas).'),

  body('estado')
    .notEmpty().withMessage('El estado es obligatorio.')
    .isIn(['disponible', 'no_disponible']).withMessage('El estado debe ser disponible o no_disponible.'),
];

const validarIdParam = [
  param('id').isInt({ min: 1 }).withMessage('El id de disponibilidad en la URL no es válido.'),
];

function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = {
  validarCrearDisponibilidad,
  validarActualizarDisponibilidad,
  validarIdParam,
  manejarErroresValidacion,
};
