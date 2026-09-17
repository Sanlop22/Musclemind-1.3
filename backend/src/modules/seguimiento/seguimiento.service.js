const SeguimientoRepository = require('./seguimiento.repository');
const seguimientoValidator = require('./seguimiento.validator');
const UserRepository = require('../users/user.repository');
const RutinaRepository = require('../rutinas/rutina.repository');

const seguimientoRepository = new SeguimientoRepository();
const userRepository = new UserRepository();
const rutinaRepository = new RutinaRepository();

const getSeguimientos = async (filtros) => {
    return await seguimientoRepository.getSeguimientos(filtros);
};

const getSeguimientoById = async (id) => {
    const seguimiento = await seguimientoRepository.getSeguimientoById(id);

    if (!seguimiento) {
        throw new Error('Registro de seguimiento no encontrado');
    }

    return seguimiento;
};

const createSeguimiento = async (seguimientoData) => {
    seguimientoValidator.validateSeguimiento(seguimientoData);

    const usuario = await userRepository.getUserById(seguimientoData.id_usuario);

    if (!usuario) {
        throw new Error('El usuario indicado no existe');
    }

    if (seguimientoData.id_rutina) {
        const rutina = await rutinaRepository.getRutinaById(seguimientoData.id_rutina);

        if (!rutina) {
            throw new Error('La rutina indicada no existe');
        }
    }

    return await seguimientoRepository.createSeguimiento(seguimientoData);
};

const updateSeguimiento = async (id, seguimientoData) => {
    seguimientoValidator.validateSeguimiento(seguimientoData, { requireUsuario: false });

    if (seguimientoData.id_rutina) {
        const rutina = await rutinaRepository.getRutinaById(seguimientoData.id_rutina);

        if (!rutina) {
            throw new Error('La rutina indicada no existe');
        }
    }

    const updated = await seguimientoRepository.updateSeguimiento(id, seguimientoData);

    if (!updated) {
        throw new Error('Registro de seguimiento no encontrado');
    }

    return {
        id_seguimiento: id,
        ...seguimientoData
    };
};

const deleteSeguimiento = async (id) => {
    const deleted = await seguimientoRepository.deleteSeguimiento(id);

    if (!deleted) {
        throw new Error('Registro de seguimiento no encontrado');
    }

    return true;
};

module.exports = {
    getSeguimientos,
    getSeguimientoById,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento
};
