const service = require('./instructor.service');

async function crear(req, res, next) {
    try {
        const instructor = await service.crearInstructor(req.body);

        res.status(201).json(instructor);

    } catch (error) {
        next(error);
    }
}

async function listar(req, res, next) {
    try {
        const instructores = await service.listarInstructores();

        res.status(200).json(instructores);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listar
};
