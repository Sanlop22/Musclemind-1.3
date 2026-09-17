const express = require('express');

const router = express.Router();

const seguimientoController = require('./seguimiento.controller');

router.get('/', seguimientoController.getSeguimientos);

router.get('/:id', seguimientoController.getSeguimientoById);

router.post('/', seguimientoController.createSeguimiento);

router.put('/:id', seguimientoController.updateSeguimiento);

router.delete('/:id', seguimientoController.deleteSeguimiento);

module.exports = router;
