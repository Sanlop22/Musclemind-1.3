const express = require('express');
const userRoutes = require('./models/Usuarios/user.routes');

const app = express();

// Permite recibir datos en formato JSON
app.use(express.json());
app.use('/api/usuarios', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API MuscleMind funcionando');
});

module.exports = app;