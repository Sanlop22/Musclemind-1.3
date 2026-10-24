require('dotenv').config();

// Sin JWT_SECRET no se pueden firmar ni verificar sesiones: es mejor
// detener el servidor con un mensaje claro que arrancar sin seguridad.
if (!process.env.JWT_SECRET) {
    console.error(
        'Falta la variable JWT_SECRET en el archivo .env (mira .env.example).'
    );
    process.exit(1);
}

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
