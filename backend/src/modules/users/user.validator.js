const validateUser = (user) => {

    if (!user.nombre) {
        throw new Error('El nombre es obligatorio');
    }

    if (user.nombre.length < 3) {
        throw new Error('El nombre debe tener mínimo 3 caracteres');
    }

    if (!user.apellido) {
        throw new Error('El apellido es obligatorio');
    }

    if (!user.numero_documento) {
        throw new Error('El número de documento es obligatorio');
    }

    if (user.edad !== undefined && user.edad !== null) {
        if (isNaN(user.edad) || user.edad < 0 || user.edad > 120) {
            throw new Error('La edad debe ser un número válido entre 0 y 120');
        }
    }

    if (user.tipo_documento) {

        const tiposValidos = ['CC', 'TI', 'CE', 'PASAPORTE'];

        if (!tiposValidos.includes(user.tipo_documento.toUpperCase())) {
            throw new Error(
                `El tipo de documento debe ser uno de: ${tiposValidos.join(', ')}`
            );
        }
    }

    if (user.peso !== undefined && user.peso !== null) {
        if (isNaN(user.peso) || user.peso <= 0 || user.peso > 500) {
            throw new Error('El peso debe ser un número válido en kg');
        }
    }

    if (user.altura !== undefined && user.altura !== null) {
        if (isNaN(user.altura) || user.altura <= 0 || user.altura > 300) {
            throw new Error('La altura debe ser un número válido en cm');
        }
    }

    if (user.pais && user.pais.length < 2) {
        throw new Error('El país no es válido');
    }

};

module.exports = {
    validateUser
};