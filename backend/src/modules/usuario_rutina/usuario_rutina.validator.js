const validarAsignacion = (datos) => {
    const { id_usuario, id_rutina } = datos;

    if (!id_usuario) {
        throw new Error('El id_usuario es obligatorio');
    }

    if (!id_rutina) {
        throw new Error('El id_rutina es obligatorio');
    }

    if (!Number.isInteger(Number(id_usuario))) {
        throw new Error('El id_usuario debe ser un número entero');
    }

    if (!Number.isInteger(Number(id_rutina))) {
        throw new Error('El id_rutina debe ser un número entero');
    }

    return true;
};

module.exports = {
    validarAsignacion
};