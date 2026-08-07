const userRepository = require('./user.repository');
const userValidator = require('./user.validator');

const getUsers = async () => {
    return await userRepository.getUsers();
};

const createUser = async (userData) => {

    userValidator.validateUser(userData);

    return await userRepository.createUser(userData);

};

module.exports = {
    getUsers,
    createUser
};