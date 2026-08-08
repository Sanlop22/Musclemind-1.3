const userService = require('./user.service');

const getUsers = async (req, res) => {
    const users = await userService.getUsers();

    res.json(users);
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);

        res.json(user);
    } catch (error) {
        const status = error.message === 'Usuario no encontrado' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);

        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};