import { apiFetch } from "./api";

// El backend toma el usuario de la reserva desde el token.
export function crearReserva(datos) {
  return apiFetch("/reserva", { method: "POST", body: datos });
}

export function obtenerReservasPorUsuario(idUsuario) {
  return apiFetch(`/reserva/usuario/${idUsuario}`);
}

export function obtenerReservasPorInstructor(idInstructor) {
  return apiFetch(`/reserva/instructor/${idInstructor}`);
}
