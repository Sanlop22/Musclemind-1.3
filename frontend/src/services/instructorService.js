import { apiFetch } from "./api";

// Los instructores se crean registrándose con rol "instructor"
// (POST /usuarios); aquí solo se consultan.
export function obtenerInstructores() {
  return apiFetch("/instructor");
}
