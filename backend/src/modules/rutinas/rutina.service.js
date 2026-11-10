
const RutinaRepository = require('./rutina.repository');
const rutinaValidator = require('./rutina.validator');
const instructorRepository = require('../instructor/instructor.repository');

const rutinaRepository = new RutinaRepository();

// Obtener todas las rutinas disponibles
const getRutinas = async () => {
    return await rutinaRepository.getRutinas();
};

// Obtener una rutina por su ID
const getRutinaById = async (id) => {
    const rutina = await rutinaRepository.getRutinaById(id);

    if (!rutina) {
        throw new Error('Rutina no encontrada');
    }

    return rutina;
};

// Crear una rutina
const createRutina = async (rutinaData) => {
    rutinaValidator.validateRutina(rutinaData);

    const instructor = await instructorRepository.buscarPorId(
        rutinaData.id_instructor
    );

    if (!instructor) {
        throw new Error('El instructor indicado no existe');
    }

    return await rutinaRepository.createRutina(rutinaData);
};

// Actualizar una rutina
const updateRutina = async (id, rutinaData) => {
    rutinaValidator.validateRutina(rutinaData, {
        requireInstructor: false
    });

    const updated = await rutinaRepository.updateRutina(id, rutinaData);

    if (!updated) {
        throw new Error('Rutina no encontrada');
    }

    return {
        id_rutina: id,
        ...rutinaData
    };
};

// Eliminar una rutina
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
