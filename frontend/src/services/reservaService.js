
import { apiFetch } from "./api";

// El backend toma el usuario desde el token.
export function crearReserva(datos) {
    return apiFetch("/reserva", {
        method: "POST",
        body: datos
    });
}

export function obtenerReservasPorUsuario(idUsuario) {
    return apiFetch(`/reserva/usuario/${idUsuario}`);
}

export function obtenerReservasPorInstructor(idInstructor) {
    return apiFetch(`/reserva/instructor/${idInstructor}`);
}

// Consultar los horarios que ya tienen reservas.
export function obtenerHorariosOcupados(idInstructor, fecha) {
    return apiFetch(
        `/reserva/horarios-ocupados/${idInstructor}?fecha=${fecha}`
    );
}
// Cambiar el estado de una reserva.
export function actualizarEstadoReserva(idReserva, estado) {
    return apiFetch(`/reserva/${idReserva}/estado`, {
        method: "PATCH",
        body: { estado }
    });
}