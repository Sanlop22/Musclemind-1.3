const service = require('./reserva.service');

async function crear(req, res, next) {
  try {
    const reserva = await service.crearReserva(req.body);
    res.status(201).json(reserva);
  } catch (error) {
    next(error);
  }
}

async function listarPorUsuario(req, res, next) {
  try {
    const { idUsuario } = req.params;
    const reservas = await service.listarPorUsuario(idUsuario);
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
}

async function listarPorInstructor(req, res, next) {
  try {
    const { idInstructor } = req.params;
    const reservas = await service.listarPorInstructor(idInstructor);
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const actualizada = await service.cambiarEstado(id, estado);
    res.status(200).json(actualizada);
  } catch (error) {
    next(error);
  }
}

module.exports = { crear, listarPorUsuario, listarPorInstructor, cambiarEstado };
