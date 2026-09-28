// Valida la FORMA de los datos de entrada (tipos, campos obligatorios,
// longitudes). Las reglas de NEGOCIO (relaciones entre datos, permisos,
// etc.) van en el Service, no aquí.
const { body, validationResult } = require('express-validator');

const crearHistorialValidator = [
  body('idUsuario')
    .notEmpty().withMessage('El id del usuario es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id del usuario debe ser un número entero válido.'),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isISO8601().withMessage('La fecha debe tener el formato YYYY-MM-DD.'),

  body('registroProgreso')
    .trim()
    .notEmpty().withMessage('El registro de progreso es obligatorio.')
    .isLength({ min: 2, max: 255 }).withMessage('El registro de progreso debe tener entre 2 y 255 caracteres.'),
];

/**
 * Middleware que revisa si express-validator encontró errores en las
 * reglas de arriba. Si hay errores, corta la petición con 400 y no deja
 * que llegue al controller.
 */
function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = {
  crearHistorialValidator,
  manejarErroresValidacion,
};
