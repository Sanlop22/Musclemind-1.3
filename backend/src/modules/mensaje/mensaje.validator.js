const { body, validationResult } = require('express-validator');

const crearMensajeValidator = [
  body('idUsuario')
    .notEmpty().withMessage('El id del usuario es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id del usuario debe ser un número entero válido.'),

  body('idInstructor')
    .notEmpty().withMessage('El id del instructor es obligatorio.')
    .isInt({ min: 1 }).withMessage('El id del instructor debe ser un número entero válido.'),

  // Nota: mientras el proyecto no tenga JWT, no hay forma de saber desde
  // el servidor "quién está autenticado", así que remitente se recibe
  // explícito en el body (igual que idUsuario/idInstructor en los demás
  // módulos). Cuando se agregue autenticación, este sería el único punto
  // a ajustar: en vez de confiar en este campo, el controller lo
  // calcularía a partir de req.user (rol del token).
  body('remitente')
    .notEmpty().withMessage('El remitente es obligatorio.')
    .isIn(['usuario', 'instructor']).withMessage('El remitente debe ser "usuario" o "instructor".'),

  body('contenido')
    .trim()
    .notEmpty().withMessage('El contenido del mensaje es obligatorio.')
    .isLength({ min: 1, max: 500 }).withMessage('El contenido debe tener entre 1 y 500 caracteres.'),
];

function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array().map((e) => e.msg) });
  }
  next();
}

module.exports = {
  crearMensajeValidator,
  manejarErroresValidacion,
};
