const express = require('express');

const router = express.Router();

const userController = require('./user.controller');

const { verificarToken, autorizarRoles } = require('../../middlewares/auth.middleware');
const { soloMismoUsuario } = require('../../middlewares/permisos.middleware');

// Rutas públicas: iniciar sesión y registrarse
router.post('/login', userController.loginUser);

router.post('/', userController.createUser);

// Rutas protegidas
// Listar todos los usuarios: solo un administrador
router.get('/', verificarToken, autorizarRoles('admin'), userController.getUsers);

// Consultar, actualizar o eliminar una cuenta: solo su dueño
// (el administrador también puede consultar y eliminar)
router.get('/:id', verificarToken, soloMismoUsuario('id', { permitirAdmin: true }), userController.getUserById);

router.put('/:id', verificarToken, soloMismoUsuario('id'), userController.updateUser);

router.delete('/:id', verificarToken, soloMismoUsuario('id', { permitirAdmin: true }), userController.deleteUser);

module.exports = router;
