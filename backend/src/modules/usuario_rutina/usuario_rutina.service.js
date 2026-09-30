const UsuarioRutinaRepository = require('./usuario_rutina.repository');
const usuarioRutinaValidator = require('./usuario_rutina.validator');

const usuarioRutinaRepository = new UsuarioRutinaRepository();

const asignarRutina = async (id_usuario, id_rutina) => {

    usuarioRutinaValidator.validarAsignacion({
        id_usuario,
        id_rutina
    });

    return await usuarioRutinaRepository.asignarRutina(
        id_usuario,
        id_rutina
    );
};

const obtenerRutinasUsuario = async (id_usuario) => {

    return await usuarioRutinaRepository.obtenerRutinasUsuario(
        id_usuario
    );
};

module.exports = {
    asignarRutina,
    obtenerRutinasUsuario
};