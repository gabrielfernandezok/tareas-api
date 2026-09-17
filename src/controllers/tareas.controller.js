// Este controlador recibe las peticiones HTTP y coordina las respuestas de la API.

const tareasService = require('../services/tareas.service');

// Convierte el parámetro de ruta a número y valida que sea un entero positivo.
function obtenerId(parametroId) {
    const id = Number(parametroId);

    return Number.isInteger(id) && id > 0 ? id : undefined;
}

// Comprueba los campos permitidos y obligatorios de una tarea.
function validarDatos(datos, esActualizacion = false) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        return 'El cuerpo de la petición debe ser un objeto JSON.';
    }

    if (!esActualizacion && (typeof datos.titulo !== 'string' || !datos.titulo.trim())) {
        return 'El campo titulo es obligatorio y debe ser texto.';
    }

    if (datos.titulo !== undefined && (typeof datos.titulo !== 'string' || !datos.titulo.trim())) {
        return 'El campo titulo debe ser texto no vacío.';
    }

    if (datos.descripcion !== undefined && typeof datos.descripcion !== 'string') {
        return 'El campo descripcion debe ser texto.';
    }

    if (datos.completada !== undefined && typeof datos.completada !== 'boolean') {
        return 'El campo completada debe ser booleano.';
    }

    if (!esActualizacion && (!Number.isInteger(datos.categoriaId) || datos.categoriaId <= 0)) {
        return 'El campo categoriaId es obligatorio y debe ser un entero positivo.';
    }

    if (datos.categoriaId !== undefined && (!Number.isInteger(datos.categoriaId) || datos.categoriaId <= 0)) {
        return 'El campo categoriaId debe ser un entero positivo.';
    }

    return undefined;
}

// GET /tareas: devuelve todas las tareas.
async function obtenerTodas(req, res) {
    res.json(await tareasService.obtenerTodas(req.usuario.usuarioId));
}

// GET /tareas/:id: devuelve una tarea concreta.
async function obtenerPorId(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const tarea = await tareasService.obtenerPorId(id, req.usuario.usuarioId);

    if (!tarea) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    return res.json(tarea);
}

// POST /tareas: crea una tarea nueva.
async function crear(req, res) {
    const error = validarDatos(req.body);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const tarea = await tareasService.crear({
        usuarioId: req.usuario.usuarioId,
        titulo: req.body.titulo.trim(),
        descripcion: req.body.descripcion ?? '',
        completada: req.body.completada,
        categoriaId: req.body.categoriaId,
    });

    return res.status(201).json(tarea);
}

// PUT /tareas/:id: actualiza una tarea existente.
async function actualizar(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const error = validarDatos(req.body, true);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const datos = { ...req.body };
    if (datos.titulo !== undefined) datos.titulo = datos.titulo.trim();

    const tarea = await tareasService.actualizar(id, req.usuario.usuarioId, datos);

    if (!tarea) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    return res.json(tarea);
}

// PATCH /tareas/:id/completar: marca una tarea como completada.
async function completar(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const tarea = await tareasService.completar(id, req.usuario.usuarioId);

    if (!tarea) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    return res.json(tarea);
}

// DELETE /tareas/:id: elimina una tarea existente.
async function eliminar(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const tarea = await tareasService.eliminar(id, req.usuario.usuarioId);

    if (!tarea) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    return res.status(204).send();
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    completar,
    eliminar,
};
