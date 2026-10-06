const API_URL = "http://localhost:3000/api/instructor";

export async function crearInstructor(datos) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al crear instructor");
    }

    return data;
}

export async function obtenerInstructores() {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener los instructores");
    }

    return data;
}