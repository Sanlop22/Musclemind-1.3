import { apiFetch } from "./api";

export function iniciarSesion(correo, contrasena) {
  return apiFetch("/usuarios/login", {
    method: "POST",
    body: { correo, contrasena },
  });
}

export function registrarUsuario(datos) {
  return apiFetch("/usuarios", { method: "POST", body: datos });
}
