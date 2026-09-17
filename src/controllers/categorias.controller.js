const categoriasService = require('../services/categorias.service');

function obtenerId(parametroId) {
    const id = Number(parametroId);

    return Number.isInteger(id) && id > 0 ? id : undefined;
}

function validarDatos(datos, esActualizacion = false) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        return 'El cuerpo de la petición debe ser un objeto JSON.';
    }

    if (!esActualizacion && (typeof datos.nombre !== 'string' || !datos.nombre.trim())) {
        return 'El campo nombre es obligatorio y debe ser texto.';
    }

    if (datos.nombre !== undefined && (typeof datos.nombre !== 'string' || !datos.nombre.trim())) {
        return 'El campo nombre debe ser texto no vacío.';
    }

    return undefined;
}

async function obtenerTodas(req, res) {
    res.json(await categoriasService.obtenerTodas());
}

async function obtenerPorId(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const categoria = await categoriasService.obtenerPorId(id);

    if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoria no encontrada.' });
    }

    return res.json(categoria);
}

async function crear(req, res) {
    const error = validarDatos(req.body);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const categoria = await categoriasService.crear(req.body.nombre.trim());
    return res.status(201).json(categoria);
}

async function actualizar(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const error = validarDatos(req.body, true);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const datos = {};
    if (req.body.nombre !== undefined) datos.nombre = req.body.nombre.trim();

    const categoria = await categoriasService.actualizar(id, datos);

    if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoria no encontrada.' });
    }

    return res.json(categoria);
}

async function eliminar(req, res) {
    const id = obtenerId(req.params.id);

    if (!id) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo.' });
    }

    const resultado = await categoriasService.eliminar(id);

    if (!resultado) {
        return res.status(404).json({ mensaje: 'Categoria no encontrada.' });
    }

    if (resultado.tareas > 0) {
        return res.status(409).json({ mensaje: 'No se puede eliminar una categoria con tareas asociadas.' });
    }

    return res.status(204).send();
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
};
