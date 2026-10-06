const API_URL = "http://localhost:3000/api/disponibilidad";

export async function obtenerDisponibilidadPorInstructor(idInstructor) {

    const response = await fetch(
        `${API_URL}/instructor/${idInstructor}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Error al obtener la disponibilidad"
        );
    }

    return data;
}