const express = require('express');
const userRoutes = require('./modules/users/user.routes');
// Registra el middleware encargado de manejar los errores de la aplicación
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
//// Permite recibir y procesar datos en formato JSON

app.use(express.json());

// Registra las rutas del módulo de usuarios

app.use('/api/usuarios', userRoutes);
// Ruta principal de la API

app.get('/', (req, res) => {
    res.send('API MuscleMind funcionando');
});

// Registra el middleware global para el manejo de errores
app.use(errorMiddleware);


module.exports = app;