const validateUser = (user) => {

    if (!user.nombre) {
        throw new Error('El nombre es obligatorio');
    }

    if (!user.apellido) {
        throw new Error('El apellido es obligatorio');
    }

    if (!user.numero_documento) {
        throw new Error('El número de documento es obligatorio');
    }

};
