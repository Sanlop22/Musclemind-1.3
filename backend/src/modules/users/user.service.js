
const UserRepository = require('./user.repository');
const userValidator = require('./user.validator');
const bcrypt = require('bcrypt');

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

    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

    const userWithPassword = {
        ...userData,
        contrasena: hashedPassword
    };

    return await userRepository.createUser(userWithPassword);
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

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};