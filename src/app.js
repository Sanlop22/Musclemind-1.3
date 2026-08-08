const express = require('express');
const userRoutes = require('./models/Usuarios/user.routes');

const app = express();

app.use(express.json());

app.use('/api/usuarios', userRoutes);

app.get('/', (req, res) => {
    res.send('API MuscleMind funcionando');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;