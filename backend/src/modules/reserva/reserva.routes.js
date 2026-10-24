const { Router } = require('express');
const controller = require('./reserva.controller');
const {
  validarCrearReserva,
  validarCambioEstado,
  validarIdUsuarioParam,
  validarIdInstructorParam,
  manejarErroresValidacion,
} = require('./reserva.validator');

const { verificarToken, autorizarRoles } = require('../../middlewares/auth.middleware');
const {
  soloMismoUsuario,
  soloMismoInstructor,
  inyectarIdUsuario,
  participanteDeReserva,
} = require('../../middlewares/permisos.middleware');

const router = Router();

// POST /api/reserva
// El usuario que reserva es SIEMPRE el autenticado (se ignora idUsuario del body).
router.post(
  '/',
  verificarToken,
  autorizarRoles('usuario'),
  inyectarIdUsuario('idUsuario'),
  validarCrearReserva,
  manejarErroresValidacion,
  controller.crear
);

// GET /api/reserva/usuario/:idUsuario -> solo las reservas del propio usuario
router.get(
  '/usuario/:idUsuario',
  verificarToken,
  validarIdUsuarioParam,
  manejarErroresValidacion,
  soloMismoUsuario('idUsuario'),
  controller.listarPorUsuario
);

// GET /api/reserva/instructor/:idInstructor -> solo las reservas del propio instructor
router.get(
  '/instructor/:idInstructor',
  verificarToken,
  autorizarRoles('instructor'),
  validarIdInstructorParam,
  manejarErroresValidacion,
  soloMismoInstructor('idInstructor'),
  controller.listarPorInstructor
);

// PATCH /api/reserva/:id/estado -> solo quienes participan en la reserva
router.patch(
  '/:id/estado',
  verificarToken,
  validarCambioEstado,
  manejarErroresValidacion,
  participanteDeReserva({ desde: 'params', campo: 'id' }),
  controller.cambiarEstado
);

module.exports = router;
