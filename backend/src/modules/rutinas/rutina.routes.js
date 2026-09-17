const express = require('express');

const router = express.Router();

const rutinaController = require('./rutina.controller');

router.get('/', rutinaController.getRutinas);

router.get('/:id', rutinaController.getRutinaById);

router.post('/', rutinaController.createRutina);

router.put('/:id', rutinaController.updateRutina);

router.delete('/:id', rutinaController.deleteRutina);

module.exports = router;
