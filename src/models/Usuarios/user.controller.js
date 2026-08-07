const userService = require('./user.service');

const getUsers = async (req, res) => {

    const users = await userService.getUsers();

    res.json(users);
};

const createUser = async (req, res) => {

    const user = await userService.createUser(req.body);

    res.status(201).json(user);
};

module.exports = {
    getUsers,
    createUser
};