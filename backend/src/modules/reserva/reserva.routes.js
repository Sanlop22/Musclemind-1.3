
const { Router } = require('express');
const controller = require('./reserva.controller');

const {
  validarCrearReserva,
  validarCambioEstado,
  validarIdUsuarioParam,
  validarIdInstructorParam,
  validarConsultaHorariosOcupados,
  manejarErroresValidacion,
} = require('./reserva.validator');

const {
  verificarToken,
  autorizarRoles
} = require('../../middlewares/auth.middleware');

const {
  soloMismoUsuario,
  soloMismoInstructor,
  inyectarIdUsuario,
  participanteDeReserva,
} = require('../../middlewares/permisos.middleware');

const router = Router();
console.log('RUTAS DE RESERVA CARGADAS');

// POST /api/reserva
// El usuario que reserva es siempre el autenticado.
router.post(
  '/',
  verificarToken,
  autorizarRoles('usuario'),
  inyectarIdUsuario('idUsuario'),
  validarCrearReserva,
  manejarErroresValidacion,
  controller.crear
);

// GET /api/reserva/horarios-ocupados/:idInstructor?fecha=YYYY-MM-DD
// Devuelve únicamente los horarios ocupados.
router.get(
  '/horarios-ocupados/:idInstructor',
  verificarToken,
  autorizarRoles('usuario'),
  validarConsultaHorariosOcupados,
  manejarErroresValidacion,
  controller.listarHorariosOcupados
);

// GET /api/reserva/usuario/:idUsuario
router.get(
  '/usuario/:idUsuario',
  verificarToken,
  validarIdUsuarioParam,
  manejarErroresValidacion,
  soloMismoUsuario('idUsuario'),
  controller.listarPorUsuario
);

// GET /api/reserva/instructor/:idInstructor
router.get(
  '/instructor/:idInstructor',
  verificarToken,
  autorizarRoles('instructor'),
  validarIdInstructorParam,
  manejarErroresValidacion,
  soloMismoInstructor('idInstructor'),
  controller.listarPorInstructor
);

// PATCH /api/reserva/:id/estado
router.patch(
  '/:id/estado',
  verificarToken,
  validarCambioEstado,
  manejarErroresValidacion,
  participanteDeReserva({ desde: 'params', campo: 'id' }),
  controller.cambiarEstado
);

module.exports = router;
