import { apiFetch } from "./api";

export function registrarPago(datos) {
  return apiFetch("/pago", { method: "POST", body: datos });
}

export function obtenerPagoPorReserva(idReserva) {
  return apiFetch(`/pago/reserva/${idReserva}`);
}

export function actualizarEstadoPago(idReserva, datos) {
  return apiFetch(`/pago/reserva/${idReserva}/estado`, {
    method: "PATCH",
    body: datos,
  });
}
