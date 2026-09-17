const jwt = require('jsonwebtoken');

const secretoJwt = process.env.JWT_SECRET || 'secreto-de-desarrollo-cambiar-en-produccion';

function verificarToken(req, res, next) {
    const cabecera = req.headers.authorization;
    const [esquema, token] = cabecera ? cabecera.split(' ') : [];

    if (esquema !== 'Bearer' || !token) {
        return res.status(401).json({ mensaje: 'Debes enviar un token Bearer.' });
    }

    try {
        req.usuario = jwt.verify(token, secretoJwt);
        return next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
}

module.exports = verificarToken;