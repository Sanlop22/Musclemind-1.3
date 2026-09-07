const { body, validationResult } = require('express-validator');

/**
 * Reglas de VALIDACIÓN DE FORMA únicamente.
 * Ninguna de estas reglas toca la base de datos —
 * eso es responsabilidad del Service, no de este archivo.
 */
const validarCrearInstructor = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 45 }).withMessage('El nombre debe tener entre 2 y 45 caracteres.'),

  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isLength({ min: 2, max: 45 }).withMessage('El apellido debe tener entre 2 y 45 caracteres.'),

  body('experiencia')
    .notEmpty().withMessage('La experiencia es obligatoria.')
    .isInt({ min: 0 }).withMessage('La experiencia debe ser un número entero mayor o igual a 0.'),

  body('especialidad')
    .trim()
    .notEmpty().withMessage('La especialidad es obligatoria.')
    .isLength({ min: 2, max: 45 }).withMessage('La especialidad debe tener entre 2 y 45 caracteres.'),

  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('El correo no tiene un formato válido.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
];

/**
 * Middleware que revisa si alguna de las reglas de arriba falló.
 * Si falló, corta aquí con 400 — el controller nunca se ejecuta.
 */
function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = { validarCrearInstructor, manejarErroresValidacion };
