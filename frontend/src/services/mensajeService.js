const API_URL = "http://localhost:3000/api/mensaje";

export async function crearMensaje(datos) {

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
            "Error al enviar el mensaje";

        throw new Error(mensaje);
    }

    return data;
}

export async function obtenerConversacion(
    idUsuario,
    idInstructor
) {

    const response = await fetch(
        `${API_URL}/conversacion/${idUsuario}/${idInstructor}`
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.error ||
            "Error al obtener la conversación"
        );
    }

    return data;
}