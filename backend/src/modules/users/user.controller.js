const userService = require('./user.service');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        res.json(user);
    } catch (error) {
        const status =
            error.message === 'Usuario no encontrado' ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        console.log("BODY DEL POST:", req.body);

        const user = await userService.createUser(req.body);

        res.status(201).json(user);
    } catch (error) {
        console.log("ERROR DEL POST:", error.message);

        res.status(400).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        res.json(user);
    } catch (error) {
        const status =
            error.message === 'Usuario no encontrado' ? 404 : 400;

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

const loginUser = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                error: 'El correo electrónico y la contraseña son obligatorios'
            });
        }

        const result = await userService.loginUser(
            correo,
            contrasena
        );

        res.json(result);

    } catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};