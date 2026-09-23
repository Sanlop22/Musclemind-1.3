const service = require('./instructor.service');

async function crear(req, res, next) {
  try {
    const instructor = await service.crearInstructor(req.body);
    res.status(201).json(instructor);
  } catch (error) {
    next(error);
  }
}

module.exports = { crear };
