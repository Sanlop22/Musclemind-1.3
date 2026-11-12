
import { apiFetch } from "./api";

// Procesar el pago simulado desde el backend.
export function registrarPago(datos) {
    return apiFetch("/pago", {
        method: "POST",
        body: datos
    });
}

// Consultar el pago de una reserva.
export function obtenerPagoPorReserva(idReserva) {
    return apiFetch(`/pago/reserva/${idReserva}`);
}

