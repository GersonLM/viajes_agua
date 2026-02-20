const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/periodoController');

router.get('/', periodoController.obtenerPeriodos);
router.get('/activo', periodoController.obtenerPeriodoActivo);
router.get('/:id', periodoController.obtenerPeriodoPorId);
router.post('/', periodoController.crearPeriodo);
router.put('/:id', periodoController.actualizarPeriodo);
router.put('/:id/cerrar', periodoController.cerrarPeriodo);
router.put('/:id/pagar', periodoController.marcarComoPagado);
router.delete('/:id', periodoController.eliminarPeriodo);

module.exports = router;
