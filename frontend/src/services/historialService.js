const API_URL = "http://localhost:3000/api/historial";


export async function crearHistorial(datos) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    const data = await response.json();

    if (!response.ok) {

        const mensaje =
            data.error ||
            data.errores?.join(", ") ||
            "Error al crear el registro de historial";

        throw new Error(mensaje);
    }

    return data;
}


export async function obtenerHistorial(idUsuario) {

    const response = await fetch(
        `${API_URL}/usuario/${idUsuario}`
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.error ||
            "Error al obtener el historial"
        );
    }

    return data;
}