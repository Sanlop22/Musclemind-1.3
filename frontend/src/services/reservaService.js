const API_URL = "http://localhost:3000/api/reserva";

export async function crearReserva(datos) {

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
            "Error al crear la reserva";

        throw new Error(mensaje);
    }

    return data;
}

export async function obtenerReservasPorUsuario(idUsuario) {

    const response = await fetch(
        `${API_URL}/usuario/${idUsuario}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Error al obtener las reservas"
        );
    }

    return data;
}

export async function obtenerReservasPorInstructor(idInstructor) {

    const response = await fetch(
        `${API_URL}/instructor/${idInstructor}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Error al obtener las reservas del instructor"
        );
    }

    return data;
}