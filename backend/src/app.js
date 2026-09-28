const express = require('express');
const cors = require('cors');
const userRoutes = require('./modules/users/user.routes');
const instructorRoutes = require('./modules/instructor/instructor.routes');
const disponibilidadRoutes = require('./modules/disponibilidad/disponibilidad.routes');
const reservaRoutes = require('./modules/reserva/reserva.routes');
const mensajeRoutes = require('./modules/mensaje/mensaje.routes');
const historialRoutes = require('./modules/historial/historial.routes');
const pagoRoutes = require('./modules/pago/pago.routes');
const calificacionRoutes = require('./modules/calificacion/calificacion.routes');
// Registra el middleware encargado de manejar los errores de la aplicación
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
app.use(cors());
//// Permite recibir y procesar datos en formato JSON


app.use(express.json());

// Registra las rutas del módulo de usuarios

app.use('/api/usuarios', userRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);
app.use('/api/reserva', reservaRoutes);
app.use('/api/mensaje', mensajeRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/pago', pagoRoutes);
app.use('/api/calificacion', calificacionRoutes);
// Ruta principal de la API

app.get('/', (req, res) => {
res.send('API MuscleMind funcionando');
});

// Registra el middleware global para el manejo de errores
app.use(errorMiddleware);


module.exports = app;