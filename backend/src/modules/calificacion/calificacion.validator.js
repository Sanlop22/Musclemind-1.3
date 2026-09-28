const { body, validationResult } = require('express-validator');

const calificarValidator = [
  body('idReserva')
    .notEmpty().withMessage('El id de la reserva es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id de la reserva debe ser un número entero válido.'),

  body('puntuacion')
    .notEmpty().withMessage('La puntuación es obligatoria.')
    .isInt({ min: 1, max: 5 }).withMessage('La puntuación debe ser un número entero entre 1 y 5.'),

  body('comentario')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 }).withMessage('El comentario debe tener máximo 255 caracteres.'),
];

function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = {
  calificarValidator,
  manejarErroresValidacion,
};
