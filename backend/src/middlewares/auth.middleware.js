const jwt = require('jsonwebtoken');

/**
 * Verifica el token JWT enviado en el encabezado
 *   Authorization: Bearer <token>
 * Si es válido, deja los datos del usuario autenticado en req.user:
 *   { id_usuario, rol, id_instructor }
 * Los controladores deben usar req.user para saber QUIÉN hace la petición,
 * nunca un id enviado por el cliente en el body o en la URL.
 */
function verificarToken(req, res, next) {
    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        return res.status(500).json({
            error: 'El servidor no tiene configurado JWT_SECRET.'
        });
    }

    const encabezado = req.headers.authorization || '';
    const [tipo, token] = encabezado.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            error: 'Debes iniciar sesión para acceder a este recurso.'
        });
    }

    try {
        const payload = jwt.verify(token, secreto, { algorithms: ['HS256'] });

        req.user = {
            id_usuario: payload.id_usuario,
            rol: payload.rol,
            id_instructor: payload.id_instructor ?? null
        };

        next();
    } catch (error) {
        const mensaje = error.name === 'TokenExpiredError'
            ? 'Tu sesión expiró. Inicia sesión nuevamente.'
            : 'Token inválido.';

        return res.status(401).json({ error: mensaje });
    }
}

/**
 * Autorización por roles. Se usa DESPUÉS de verificarToken:
 *   router.post('/', verificarToken, autorizarRoles('instructor'), ...)
 * Roles existentes: 'usuario', 'instructor' y 'admin'
 * (el rol admin solo se asigna directamente en la base de datos).
 */
function autorizarRoles(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({
                error: 'No tienes permiso para realizar esta acción.'
            });
        }

        next();
    };
}

module.exports = {
    verificarToken,
    autorizarRoles
};
