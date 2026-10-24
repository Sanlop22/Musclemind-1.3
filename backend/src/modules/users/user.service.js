const UserRepository = require('./user.repository');
const userValidator = require('./user.validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    userValidator.validateUser(userData, { esRegistro: true });

    const hashedPassword = await bcrypt.hash(
        userData.contrasena,
        10
    );

    const userWithPassword = {
        ...userData,
        contrasena: hashedPassword
    };

    // Crear el usuario (el repository devuelve el usuario SIN contraseña)
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

    // Se devuelven únicamente los campos que realmente se actualizan;
    // así nunca se "devuelve" una contraseña que venga en el body.
    const {
        nombre,
        apellido,
        edad,
        tipo_documento,
        numero_documento,
        peso,
        altura,
        pais
    } = userData;

    return {
        id_usuario: Number(id),
        nombre,
        apellido,
        edad,
        tipo_documento,
        numero_documento,
        peso,
        altura,
        pais
    };
};

const deleteUser = async (id) => {
    const deleted = await userRepository.deleteUser(id);

    if (!deleted) {
        throw new Error('Usuario no encontrado');
    }

    return true;
};

/**
 * Genera el JWT de la sesión. El token lleva solo lo necesario para
 * autenticar y autorizar: id del usuario, su rol y, si es instructor,
 * su id_instructor. Nunca lleva la contraseña.
 */
const generarToken = ({ id_usuario, rol, id_instructor }) => {
    return jwt.sign(
        { id_usuario, rol, id_instructor },
        process.env.JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: process.env.JWT_EXPIRES_IN || '8h'
        }
    );
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

    const rol = user.rol || 'usuario';

    // Si la cuenta es de instructor, se busca su id_instructor para que
    // los endpoints de instructor puedan validar a quién pertenece cada dato.
    let idInstructor = null;

    if (rol === 'instructor') {
        const instructor = await instructorRepository.buscarPorUsuario(
            user.id_usuario
        );

        idInstructor = instructor ? instructor.id_instructor : null;
    }

    const token = generarToken({
        id_usuario: user.id_usuario,
        rol,
        id_instructor: idInstructor
    });

    return {
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            rol,
            id_instructor: idInstructor
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
