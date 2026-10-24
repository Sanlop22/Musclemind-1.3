import { apiFetch } from "./api";

export function crearSeguimiento(datos) {
  return apiFetch("/seguimiento", { method: "POST", body: datos });
}

export function obtenerSeguimientos() {
  return apiFetch("/seguimiento");
}
