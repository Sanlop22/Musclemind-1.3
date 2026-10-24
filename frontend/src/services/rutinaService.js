import { apiFetch } from "./api";

export function obtenerRutinas() {
  return apiFetch("/rutinas");
}

export function crearRutina(rutina) {
  return apiFetch("/rutinas", { method: "POST", body: rutina });
}
