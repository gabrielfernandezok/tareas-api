const express = require('express');
const categoriasController = require('../controllers/categorias.controller');
const verificarToken = require('../middlewares/verificarToken');

const router = express.Router();
router.use(verificarToken);

router.get('/', categoriasController.obtenerTodas);
router.post('/', categoriasController.crear);
router.get('/:id', categoriasController.obtenerPorId);
router.put('/:id', categoriasController.actualizar);
router.delete('/:id', categoriasController.eliminar);

module.exports = router;
