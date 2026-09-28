const { body, validationResult } = require('express-validator');

const METODOS_VALIDOS = ['efectivo', 'tarjeta', 'transferencia', 'otro'];
const ESTADOS_VALIDOS = ['pendiente', 'pagado', 'reembolsado', 'fallido'];

const registrarPagoValidator = [
  body('idReserva')
    .notEmpty().withMessage('El id de la reserva es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id de la reserva debe ser un número entero válido.'),

  body('monto')
    .notEmpty().withMessage('El monto es obligatorio.')
    .isFloat({ min: 0.01 }).withMessage('El monto debe ser un número mayor que 0.'),

  body('metodoPago')
    .optional()
    .isIn(METODOS_VALIDOS).withMessage(`El método de pago debe ser uno de: ${METODOS_VALIDOS.join(', ')}.`),
];

const actualizarEstadoPagoValidator = [
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio.')
    .isIn(ESTADOS_VALIDOS).withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`),

  body('referenciaExterna')
    .optional({ nullable: true })
    .isLength({ max: 100 }).withMessage('La referencia externa debe tener máximo 100 caracteres.'),
];

function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = {
  registrarPagoValidator,
  actualizarEstadoPagoValidator,
  manejarErroresValidacion,
};
