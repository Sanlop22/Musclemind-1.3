import { apiFetch } from "./api";

export function obtenerDisponibilidadPorInstructor(idInstructor) {
  return apiFetch(`/disponibilidad/instructor/${idInstructor}`);
}
