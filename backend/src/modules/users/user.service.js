

const UserRepository = require('./user.repository');
const userValidator = require('./user.validator');
const bcrypt = require('bcrypt');
const instructorRepository = require('../instructor/instructor.repository');

const userRepository = new UserRepository();

const getUsers = async () => {
    return await userRepository.getUsers();
};

const getUserById = async (id) => {
    const user = await userRepository.getUserById(id);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    return user;
};

const createUser = async (userData) => {
    userValidator.validateUser(userData);

    const hashedPassword = await bcrypt.hash(
        userData.contrasena,
        10
    );

    const userWithPassword = {
        ...userData,
        contrasena: hashedPassword
    };

    // Crear el usuario
    const usuarioCreado = await userRepository.createUser(
        userWithPassword
    );

    // Si es instructor, crear también su registro
    // en la tabla instructor
    if (userData.rol === 'instructor') {

        await instructorRepository.crear({
            nombre: userData.nombre,
            apellido: userData.apellido,
            experiencia: userData.experiencia,
            especialidad: userData.especialidad,
            id_usuario: usuarioCreado.id_usuario
        });
    }

    return usuarioCreado;
};

const updateUser = async (id, userData) => {
    userValidator.validateUser(userData);

    const updated = await userRepository.updateUser(id, userData);

    if (!updated) {
        throw new Error('Usuario no encontrado');
    }

    return {
        id_usuario: id,
        ...userData
    };
};

const deleteUser = async (id) => {
    const deleted = await userRepository.deleteUser(id);

    if (!deleted) {
        throw new Error('Usuario no encontrado');
    }

    return true;
};
const loginUser = async (correo, contrasena) => {
    const user = await userRepository.getUserByEmail(correo);

    if (!user) {
        throw new Error('Credenciales incorrectas');
    }

    const passwordCorrect = await bcrypt.compare(
        contrasena,
        user.contrasena
    );

    if (!passwordCorrect) {
        throw new Error('Credenciales incorrectas');
    }

    return {
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo
        }
    };
};
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};