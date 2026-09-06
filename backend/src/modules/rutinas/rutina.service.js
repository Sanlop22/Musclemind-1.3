const RutinaRepository = require('./rutina.repository');
const rutinaValidator = require('./rutina.validator');
const UserRepository = require('../users/user.repository');

const rutinaRepository = new RutinaRepository();
const userRepository = new UserRepository();

const getRutinas = async (id_usuario) => {
    return await rutinaRepository.getRutinas(id_usuario);
};

const getRutinaById = async (id) => {
    const rutina = await rutinaRepository.getRutinaById(id);

    if (!rutina) {
        throw new Error('Rutina no encontrada');
    }

    return rutina;
};

const createRutina = async (rutinaData) => {
    rutinaValidator.validateRutina(rutinaData);

    const usuario = await userRepository.getUserById(rutinaData.id_usuario);

    if (!usuario) {
        throw new Error('El usuario indicado no existe');
    }

    return await rutinaRepository.createRutina(rutinaData);
};

const updateRutina = async (id, rutinaData) => {
    // El id_usuario de una rutina no se reasigna en la actualización,
    // así que aquí solo se valida el formato de los demás campos.
    rutinaValidator.validateRutina(rutinaData, { requireUsuario: false });

    const updated = await rutinaRepository.updateRutina(id, rutinaData);

    if (!updated) {
        throw new Error('Rutina no encontrada');
    }

    return {
        id_rutina: id,
        ...rutinaData
    };
};

const deleteRutina = async (id) => {
    const deleted = await rutinaRepository.deleteRutina(id);

    if (!deleted) {
        throw new Error('Rutina no encontrada');
    }

    return true;
};

module.exports = {
    getRutinas,
    getRutinaById,
    createRutina,
    updateRutina,
    deleteRutina
};
