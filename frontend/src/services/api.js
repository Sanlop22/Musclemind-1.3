import { obtenerToken, cerrarSesion } from "../utils/session";

// La URL de la API se configura en el archivo .env (VITE_API_URL).
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

/**
 * Hace una petición a la API enviando el token JWT (si hay sesión).
 * - Devuelve el JSON de la respuesta (o null si no trae cuerpo).
 * - Si la API responde 401 (token inválido o vencido) cierra la sesión
 *   y envía al usuario a /login.
 * - Si responde con error lanza un Error con el mensaje de la API.
 */
export async function apiFetch(ruta, { method = "GET", body } = {}) {
  const token = obtenerToken();

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let datos = null;
  const texto = await respuesta.text();
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = null;
    }
  }

  if (!respuesta.ok) {
    // Sesión vencida o token inválido (no aplica al intento de login)
    if (respuesta.status === 401 && token) {
      cerrarSesion();
      window.location.href = "/login";
    }

    const mensaje =
      datos?.error ||
      datos?.errores?.join(", ") ||
      "Ocurrió un error al comunicarse con el servidor";

    throw new Error(mensaje);
  }

  return datos;
}
