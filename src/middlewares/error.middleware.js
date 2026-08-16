//Crea el middleware encargado de recibir los errores de la aplicación.
const errorMiddleware = (err, req, res, next) => {
 //Muestra el error en la terminal para poder identificarlo.
    console.error(err);
//Devuelve el código HTTP del error. Si no existe uno específico, utiliza:
    res.status(err.status || 500)
// devuelve el mensaje en formato JSON.
    .json({
        error: err.message || 'Error interno del servidor'
    });
};
//permite utilizar este middleware desde app.js.
module.exports = errorMiddleware;