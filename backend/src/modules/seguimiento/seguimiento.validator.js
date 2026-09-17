const validateSeguimiento = (seguimiento, { requireUsuario = true } = {}) => {

    if (requireUsuario) {
        if (!seguimiento.id_usuario) {
            throw new Error('El id_usuario es obligatorio');
        }

        if (isNaN(seguimiento.id_usuario)) {
            throw new Error('El id_usuario debe ser un número válido');
        }
    }

    if (!seguimiento.fecha) {
        throw new Error('La fecha es obligatoria');
    }

    if (isNaN(Date.parse(seguimiento.fecha))) {
        throw new Error('La fecha debe tener un formato válido (YYYY-MM-DD)');
    }

    if (seguimiento.id_rutina !== undefined && seguimiento.id_rutina !== null) {
        if (isNaN(seguimiento.id_rutina)) {
            throw new Error('El id_rutina debe ser un número válido');
        }
    }

    if (seguimiento.peso !== undefined && seguimiento.peso !== null) {
        if (isNaN(seguimiento.peso) || seguimiento.peso <= 0 || seguimiento.peso > 500) {
            throw new Error('El peso debe ser un número válido en kg');
        }
    }

    if (seguimiento.porcentaje_grasa !== undefined && seguimiento.porcentaje_grasa !== null) {
        if (isNaN(seguimiento.porcentaje_grasa) || seguimiento.porcentaje_grasa < 0 || seguimiento.porcentaje_grasa > 100) {
            throw new Error('El porcentaje de grasa debe estar entre 0 y 100');
        }
    }

    if (seguimiento.masa_muscular !== undefined && seguimiento.masa_muscular !== null) {
        if (isNaN(seguimiento.masa_muscular) || seguimiento.masa_muscular < 0 || seguimiento.masa_muscular > 100) {
            throw new Error('La masa muscular debe estar entre 0 y 100');
        }
    }

    if (seguimiento.series_completadas !== undefined && seguimiento.series_completadas !== null) {
        if (isNaN(seguimiento.series_completadas) || seguimiento.series_completadas < 0) {
            throw new Error('Las series completadas deben ser un número válido');
        }
    }

    if (seguimiento.repeticiones_completadas !== undefined && seguimiento.repeticiones_completadas !== null) {
        if (isNaN(seguimiento.repeticiones_completadas) || seguimiento.repeticiones_completadas < 0) {
            throw new Error('Las repeticiones completadas deben ser un número válido');
        }
    }

    if (seguimiento.nivel_esfuerzo !== undefined && seguimiento.nivel_esfuerzo !== null) {
        if (isNaN(seguimiento.nivel_esfuerzo) || seguimiento.nivel_esfuerzo < 1 || seguimiento.nivel_esfuerzo > 10) {
            throw new Error('El nivel de esfuerzo debe ser un número entre 1 y 10');
        }
    }

};

module.exports = {
    validateSeguimiento
};
