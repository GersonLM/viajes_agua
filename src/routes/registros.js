const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

router.get('/', registroController.obtenerRegistros);
router.get('/periodo/:periodoId', registroController.obtenerRegistrosPorPeriodo);
router.get('/:id', registroController.obtenerRegistroPorId);
router.post('/', registroController.crearRegistro);
router.put('/:id', registroController.actualizarRegistro);
router.delete('/:id', registroController.eliminarRegistro);

module.exports = router;
