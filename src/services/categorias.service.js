const prisma = require('../lib/prisma');

function obtenerTodas() {
    return prisma.categoria.findMany({
        orderBy: { id: 'asc' },
    });
}

function obtenerPorId(id) {
    return prisma.categoria.findUnique({ where: { id } });
}

function crear(nombre) {
    return prisma.categoria.create({
        data: { nombre },
    });
}

async function actualizar(id, datos) {
    const resultado = await prisma.categoria.updateMany({
        where: { id },
        data: datos,
    });

    return resultado.count ? obtenerPorId(id) : undefined;
}

async function eliminar(id) {
    const categoria = await obtenerPorId(id);

    if (!categoria) return undefined;

    const tareas = await prisma.tarea.count({ where: { categoriaId: id } });

    if (tareas > 0) return { categoria, tareas };

    await prisma.categoria.delete({ where: { id } });
    return { categoria, tareas: 0 };
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
};
