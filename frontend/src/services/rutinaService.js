const API_URL = "http://localhost:3000/api/rutinas";

export const obtenerRutinas = async () => {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error("Error al obtener las rutinas");
    }

    return await respuesta.json();
};

export const crearRutina = async (rutina) => {
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rutina)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "Error al crear la rutina");
    }

    return datos;
};