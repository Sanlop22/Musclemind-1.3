
const userRepository = require('./user.repository');
const userValidator = require('./user.validator');

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

    return await userRepository.createUser(userData);
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