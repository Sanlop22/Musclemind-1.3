
const validateSeguimiento = (seguimiento, { requireUsuario = true } = {}) => {

    if (requireUsuario) {
        if (!seguimiento.id_usuario) {
            throw new Error('El id_usuario es obligatorio');
        }

        if (isNaN(seguimiento.id_usuario)) {
            throw new Error('El id_usuario debe ser un número válido');
        }
    }

    if (!seguimiento.id_rutina) {
        throw new Error('Debes seleccionar la rutina realizada');
    }

    if (isNaN(seguimiento.id_rutina)) {
        throw new Error('El id_rutina debe ser un número válido');
    }

    if (!seguimiento.fecha) {
        throw new Error('La fecha es obligatoria');
    }

    if (isNaN(Date.parse(seguimiento.fecha))) {
        throw new Error('La fecha debe tener un formato válido');
    }

    if (
        seguimiento.peso !== undefined &&
        seguimiento.peso !== null &&
        seguimiento.peso !== ''
    ) {
        if (
            isNaN(seguimiento.peso) ||
            Number(seguimiento.peso) <= 0 ||
            Number(seguimiento.peso) > 500
        ) {
            throw new Error('El peso debe ser un número válido en kg');
        }
    }

};

module.exports = {
    validateSeguimiento
};
