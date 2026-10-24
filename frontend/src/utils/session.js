// Manejo de la sesión del usuario (token JWT + datos básicos).
// Se guarda en localStorage para que sobreviva a recargar la página.

const CLAVE_TOKEN = "musclemind_token";
const CLAVE_USUARIO = "usuario";

export function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerUsuario() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

export function haySesion() {
  return Boolean(obtenerToken() && obtenerUsuario());
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}
