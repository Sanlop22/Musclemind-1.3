const { Router } = require('express');

const controller = require('./instructor.controller');

const { verificarToken } = require('../../middlewares/auth.middleware');

const router = Router();

// GET /api/instructor -> lista de instructores (requiere sesión iniciada)
router.get('/', verificarToken, controller.listar);

// Nota: los instructores se registran desde POST /api/usuarios con
// rol "instructor" (así se crea su cuenta y su perfil a la vez).

module.exports = router;
