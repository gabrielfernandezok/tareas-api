const prisma = require('../lib/prisma');

function obtenerPorEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
}

function crear(datos) {
    return prisma.usuario.create({
        data: {
            email: datos.email,
            password: datos.password,
        },
    });
}

module.exports = {
    obtenerPorEmail,
    crear,
};