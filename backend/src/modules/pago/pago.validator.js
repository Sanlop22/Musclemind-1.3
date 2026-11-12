
const { body, validationResult } = require('express-validator');

const METODOS_VALIDOS = [
  'efectivo',
  'tarjeta',
  'transferencia',
  'otro'
];

const registrarPagoValidator = [
  body('idReserva')
    .notEmpty()
    .withMessage('El ID de la reserva es obligatorio.')
    .isInt({ min: 1 })
    .withMessage('El ID de la reserva debe ser un número válido.'),

  body('metodoPago')
    .optional()
    .isIn(METODOS_VALIDOS)
    .withMessage('El método de pago no es válido.')
];

function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array()
    });
  }

  next();
}

module.exports = {
  registrarPagoValidator,
  manejarErroresValidacion
};
