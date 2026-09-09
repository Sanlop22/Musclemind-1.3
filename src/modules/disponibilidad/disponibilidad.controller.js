const service = require('./disponibilidad.service');

async function crear(req, res, next) {
  try {
    const disponibilidad = await service.crearDisponibilidad(req.body);
    res.status(201).json(disponibilidad);
  } catch (error) {
    next(error);
  }
}

async function listarPorInstructor(req, res, next) {
  try {
    const { idInstructor } = req.params;
    const bloques = await service.listarPorInstructor(idInstructor);
    res.status(200).json(bloques);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const actualizado = await service.actualizarDisponibilidad(id, req.body);
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    await service.eliminarDisponibilidad(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { crear, listarPorInstructor, actualizar, eliminar };
