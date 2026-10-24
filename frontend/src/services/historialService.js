import { apiFetch } from "./api";

// El backend toma el usuario del token; no hace falta enviar id_usuario.
export function crearHistorial(datos) {
  return apiFetch("/historial", { method: "POST", body: datos });
}

export function obtenerHistorial(idUsuario) {
  return apiFetch(`/historial/usuario/${idUsuario}`);
}
