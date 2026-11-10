
import { apiFetch } from "./api";

// Enviar un mensaje
export function crearMensaje(datos) {
    return apiFetch("/mensaje", {
        method: "POST",
        body: datos
    });
}

// Consultar mensajes de una conversación
export function obtenerConversacion(idUsuario, idInstructor) {
    return apiFetch(
        `/mensaje/conversacion/${idUsuario}/${idInstructor}`
    );
}

// Consultar conversaciones del instructor
export function obtenerConversacionesInstructor() {
    return apiFetch("/mensaje/instructor/conversaciones");
}

// Consultar conversaciones del deportista
export function obtenerConversacionesUsuario() {
    return apiFetch("/mensaje/usuario/conversaciones");
}
