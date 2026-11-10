
const express = require('express');
const router = express.Router();

const controller = require('./mensaje.controller');

const {
  crearMensajeValidator,
  manejarErroresValidacion
} = require('./mensaje.validator');

const {
  verificarToken
} = require('../../middlewares/auth.middleware');

/**
 * Identifica al remitente usando el token.
 * Evita que un usuario suplante a otro.
 */
function identidadDelRemitente(req, res, next) {
  req.body = req.body || {};

  if (req.user.rol === 'usuario') {
    req.body.idUsuario = req.user.id_usuario;
    req.body.remitente = 'usuario';
    return next();
  }

  if (
    req.user.rol === 'instructor' &&
    req.user.id_instructor !== null &&
    req.user.id_instructor !== undefined
  ) {
    req.body.idInstructor = req.user.id_instructor;
    req.body.remitente = 'instructor';
    return next();
  }

  return res.status(403).json({
    error: 'No tienes permiso para enviar mensajes.'
  });
}

/**
 * Comprueba que el usuario autenticado
 * sea participante de la conversación.
 */
function participanteDeLaConversacion(req, res, next) {
  const { idUsuario, idInstructor } = req.params;

  const esElUsuario =
    req.user.rol === 'usuario' &&
    Number(idUsuario) === Number(req.user.id_usuario);

  const esElInstructor =
    req.user.rol === 'instructor' &&
    req.user.id_instructor !== null &&
    req.user.id_instructor !== undefined &&
    Number(idInstructor) === Number(req.user.id_instructor);

  if (!esElUsuario && !esElInstructor) {
    return res.status(403).json({
      error: 'No eres parte de esta conversación.'
    });
  }

  next();
}

/**
 * POST /api/mensaje
 * Envía un mensaje.
 */
router.post(
  '/',
  verificarToken,
  identidadDelRemitente,
  crearMensajeValidator,
  manejarErroresValidacion,
  controller.crear
);

/**
 * GET /api/mensaje/instructor/conversaciones
 * Lista las conversaciones del instructor autenticado.
 */
router.get(
  '/instructor/conversaciones',
  verificarToken,
  (req, res, next) => {
    if (
      req.user.rol !== 'instructor' ||
      !req.user.id_instructor
    ) {
      return res.status(403).json({
        error: 'Solo los instructores pueden consultar sus conversaciones.'
      });
    }

    next();
  },
  controller.listarConversacionesPorInstructor
);

/**
 * GET /api/mensaje/usuario/conversaciones
 * Lista las conversaciones del deportista autenticado.
 */
router.get(
  '/usuario/conversaciones',
  verificarToken,
  (req, res, next) => {
    if (req.user.rol !== 'usuario') {
      return res.status(403).json({
        error: 'Solo los deportistas pueden consultar sus conversaciones.'
      });
    }

    next();
  },
  controller.listarConversacionesPorUsuario
);

/**
 * GET /api/mensaje/conversacion/:idUsuario/:idInstructor
 * Consulta los mensajes de una conversación.
 */
router.get(
  '/conversacion/:idUsuario/:idInstructor',
  verificarToken,
  participanteDeLaConversacion,
  controller.listarConversacion
);

module.exports = router;
