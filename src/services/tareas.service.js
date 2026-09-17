const prisma = require('../lib/prisma');

// Devuelve todas las tareas registradas.
function obtenerTodas(usuarioId) {
    return prisma.tarea.findMany({
        where: { usuarioId },
        orderBy: { id: 'asc' },
    });
}

// Busca una tarea por su identificador.
function obtenerPorId(id, usuarioId) {
    return prisma.tarea.findFirst({ where: { id, usuarioId } });
}

// Crea una tarea nueva con un identificador autogenerado.
function crear(datos) {
    return prisma.tarea.create({
        data: {
            usuarioId: datos.usuarioId,
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            completada: datos.completada ?? false,
        },
    });
}

// Actualiza únicamente los campos recibidos de una tarea existente.
async function actualizar(id, usuarioId, datos) {
    const resultado = await prisma.tarea.updateMany({
        where: { id, usuarioId },
        data: datos,
    });

    return resultado.count ? obtenerPorId(id, usuarioId) : undefined;
}

// Marca una tarea existente como completada.
async function completar(id, usuarioId) {
    const resultado = await prisma.tarea.updateMany({
        where: { id, usuarioId },
        data: { completada: true },
    });

    return resultado.count ? obtenerPorId(id, usuarioId) : undefined;
}

// Elimina una tarea y devuelve la tarea eliminada.
async function eliminar(id, usuarioId) {
    const tarea = await obtenerPorId(id, usuarioId);

    if (!tarea) return undefined;

    await prisma.tarea.deleteMany({ where: { id, usuarioId } });
    return tarea;
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    completar,
    eliminar,
};
