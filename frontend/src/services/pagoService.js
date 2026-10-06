const API_URL = "http://localhost:3000/api/pago";


export async function registrarPago(datos) {

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
            "Error al registrar el pago";

        throw new Error(mensaje);
    }


    return data;
}


export async function obtenerPagoPorReserva(idReserva) {

    const response = await fetch(
        `${API_URL}/reserva/${idReserva}`
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.error ||
            "Error al consultar el pago"
        );
    }


    return data;
}


export async function actualizarEstadoPago(
    idReserva,
    datos
) {

    const response = await fetch(
        `${API_URL}/reserva/${idReserva}/estado`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        }
    );


    const data = await response.json();


    if (!response.ok) {

        const mensaje =
            data.error ||
            data.errores?.join(", ") ||
            "Error al actualizar el estado del pago";

        throw new Error(mensaje);
    }


    return data;
}