// Estas rutas conectan cada verbo HTTP con su controlador correspondiente.

const express = require('express');
const tareasController = require('../controllers/tareas.controller');
const verificarToken = require('../middlewares/verificarToken');

const router = express.Router();
router.use(verificarToken);

// Operaciones sobre la colección completa de tareas.
router.get('/', tareasController.obtenerTodas);
router.post('/', tareasController.crear);

// Operaciones sobre una tarea concreta identificada por :id.
router.patch('/:id/completar', tareasController.completar);
router.get('/:id', tareasController.obtenerPorId);
router.put('/:id', tareasController.actualizar);
router.delete('/:id', tareasController.eliminar);

module.exports = router;
