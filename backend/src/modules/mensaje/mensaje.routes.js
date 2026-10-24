const express = require('express');
const router = express.Router();
const controller = require('./mensaje.controller');
const { crearMensajeValidator, manejarErroresValidacion } = require('./mensaje.validator');

const { verificarToken } = require('../../middlewares/auth.middleware');

/**
 * Completa el body con la identidad REAL del remitente (la del token):
 *  - si escribe un usuario: idUsuario y remitente salen del token;
 *    idInstructor (con quién habla) viene del body.
 *  - si escribe un instructor: idInstructor y remitente salen del token;
 *    idUsuario (con quién habla) viene del body.
 * Así nadie puede enviar un mensaje haciéndose pasar por otra persona.
 */
function identidadDelRemitente(req, res, next) {
  req.body = req.body || {};

  if (req.user.rol === 'usuario') {
    req.body.idUsuario = req.user.id_usuario;
    req.body.remitente = 'usuario';
    return next();
  }

  if (req.user.rol === 'instructor' && req.user.id_instructor !== null) {
    req.body.idInstructor = req.user.id_instructor;
    req.body.remitente = 'instructor';
    return next();
  }

  return res.status(403).json({ error: 'No tienes permiso para enviar mensajes.' });
}

/**
 * Solo los dos participantes de la conversación pueden leerla.
 */
function participanteDeLaConversacion(req, res, next) {
  const { idUsuario, idInstructor } = req.params;

  const esElUsuario =
    req.user.rol === 'usuario' && Number(idUsuario) === Number(req.user.id_usuario);

  const esElInstructor =
    req.user.rol === 'instructor' &&
    req.user.id_instructor !== null &&
    Number(idInstructor) === Number(req.user.id_instructor);

  if (!esElUsuario && !esElInstructor) {
    return res.status(403).json({ error: 'No eres parte de esta conversación.' });
  }

  next();
}

// POST /api/mensaje -> envía un nuevo mensaje
router.post(
  '/',
  verificarToken,
  identidadDelRemitente,
  crearMensajeValidator,
  manejarErroresValidacion,
  controller.crear
);

// GET /api/mensaje/conversacion/:idUsuario/:idInstructor -> lista la conversación
router.get(
  '/conversacion/:idUsuario/:idInstructor',
  verificarToken,
  participanteDeLaConversacion,
  controller.listarConversacion
);

module.exports = router;
