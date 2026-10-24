const reservaService = require('../modules/reserva/reserva.service');

/**
 * Middlewares de permisos sobre RECURSOS concretos (autorización a nivel
 * de dato). Se usan después de verificarToken. Evitan que un usuario
 * autenticado lea o modifique información de otro.
 */

function prohibido(res, mensaje) {
    return res.status(403).json({
        error: mensaje || 'No tienes permiso para acceder a este recurso.'
    });
}

/**
 * El id_usuario de la URL (req.params[nombre]) debe ser el del usuario
 * autenticado. Con permitirAdmin, un admin también puede pasar.
 */
function soloMismoUsuario(nombreParam, { permitirAdmin = false } = {}) {
    return (req, res, next) => {
        if (permitirAdmin && req.user.rol === 'admin') {
            return next();
        }

        if (Number(req.params[nombreParam]) !== Number(req.user.id_usuario)) {
            return prohibido(res);
        }

        next();
    };
}

/**
 * El id_instructor de la URL (req.params[nombre]) debe ser el del
 * instructor autenticado.
 */
function soloMismoInstructor(nombreParam) {
    return (req, res, next) => {
        if (
            req.user.id_instructor === null ||
            Number(req.params[nombreParam]) !== Number(req.user.id_instructor)
        ) {
            return prohibido(res);
        }

        next();
    };
}

/**
 * Pone en el body el id del usuario autenticado, ignorando cualquier valor
 * que haya enviado el cliente. Ejemplo: inyectarIdUsuario('idUsuario').
 */
function inyectarIdUsuario(campo) {
    return (req, res, next) => {
        req.body = req.body || {};
        req.body[campo] = req.user.id_usuario;
        next();
    };
}

/**
 * Igual que inyectarIdUsuario, pero con el id del instructor autenticado.
 */
function inyectarIdInstructor(campo) {
    return (req, res, next) => {
        req.body = req.body || {};
        req.body[campo] = req.user.id_instructor;
        next();
    };
}

/**
 * Exige que el usuario autenticado sea parte de la reserva indicada.
 *  - desde: 'params' o 'body' (dónde viene el id de la reserva)
 *  - campo: nombre del campo con el id de la reserva
 *  - como:  'usuario' (quien reservó), 'instructor' (a quien reservaron)
 *           o undefined (cualquiera de los dos)
 * Deja la reserva encontrada en req.reserva.
 */
function participanteDeReserva({ desde, campo, como }) {
    return async (req, res, next) => {
        try {
            const idReserva = Number(req[desde]?.[campo]);

            if (!Number.isInteger(idReserva) || idReserva < 1) {
                return res.status(400).json({
                    error: 'El id de la reserva no es válido.'
                });
            }

            const reserva = await reservaService.buscarPorId(idReserva);

            const esElUsuario =
                Number(reserva.id_usuario) === Number(req.user.id_usuario);
            const esElInstructor =
                req.user.id_instructor !== null &&
                Number(reserva.id_instructor) === Number(req.user.id_instructor);

            const permitido =
                como === 'usuario' ? esElUsuario :
                como === 'instructor' ? esElInstructor :
                (esElUsuario || esElInstructor);

            if (!permitido) {
                return prohibido(res, 'No eres parte de esta reserva.');
            }

            req.reserva = reserva;
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    soloMismoUsuario,
    soloMismoInstructor,
    inyectarIdUsuario,
    inyectarIdInstructor,
    participanteDeReserva
};
