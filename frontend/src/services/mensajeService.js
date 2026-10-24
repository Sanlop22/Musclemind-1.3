import { apiFetch } from "./api";

// El backend toma usuario/instructor y remitente del token.
export function crearMensaje(datos) {
  return apiFetch("/mensaje", { method: "POST", body: datos });
}

export function obtenerConversacion(idUsuario, idInstructor) {
  return apiFetch(`/mensaje/conversacion/${idUsuario}/${idInstructor}`);
}
