// Este controlador registra usuarios y emite tokens JWT.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosService = require('../services/usuarios.service');

const secretoJwt = process.env.JWT_SECRET || 'secreto-de-desarrollo-cambiar-en-produccion';

async function registro(req, res) {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ mensaje: 'email es obligatorio y password debe tener al menos 6 caracteres.' });
    }

    const emailNormalizado = email.trim().toLowerCase();
    if (await usuariosService.obtenerPorEmail(emailNormalizado)) {
        return res.status(409).json({ mensaje: 'El usuario ya existe.' });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);
    const usuario = await usuariosService.crear({ email: emailNormalizado, password: passwordHasheada });

    return res.status(201).json({ id: usuario.id, email: usuario.email });
}

async function login(req, res) {
    const { email, password } = req.body || {};
    const usuario = typeof email === 'string' ? await usuariosService.obtenerPorEmail(email.trim().toLowerCase()) : undefined;

    if (!usuario || typeof password !== 'string' || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ usuarioId: usuario.id, email: usuario.email }, secretoJwt, { expiresIn: '1h' });
    return res.json({ token });
}

module.exports = { registro, login };