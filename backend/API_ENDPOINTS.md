# Documentación de Endpoints — MuscleMind API

URL base local: `http://localhost:3000`

Todas las respuestas se envían en formato JSON. Los errores siguen el formato:
```json
{ "error": "mensaje descriptivo" }
```
o, cuando la validación de campos falla:
```json
{ "errores": ["mensaje 1", "mensaje 2"] }
```

---

## 1. Usuarios — `/api/usuarios`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Consultar todos los usuarios |
| GET | `/api/usuarios/:id` | Consultar un usuario por ID |
| POST | `/api/usuarios` | Registrar un nuevo usuario |
| POST | `/api/usuarios/login` | Iniciar sesión |
| PUT | `/api/usuarios/:id` | Actualizar un usuario |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario |

**POST /api/usuarios** — Registro
```json
{
  "nombre": "Sandra",
  "apellido": "Prueba",
  "edad": 30,
  "tipo_documento": "CC",
  "numero_documento": "88888888",
  "peso": 70,
  "altura": 165,
  "pais": "Colombia",
  "correo": "sandra.prueba888@gmail.com",
  "contrasena": "123456"
}
```
Respuesta: `201 Created` con el usuario creado (sin la contraseña).

**POST /api/usuarios/login**
```json
{ "correo": "sandra.prueba888@gmail.com", "contrasena": "123456" }
```
Respuesta exitosa (`200 OK`):
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": { "id_usuario": 1, "nombre": "Sandra", "apellido": "Prueba", "correo": "sandra.prueba888@gmail.com" }
}
```
Credenciales incorrectas → `401 Unauthorized`. Campos faltantes → `400 Bad Request`.

**PUT /api/usuarios/:id** — actualiza nombre, apellido, edad, tipo_documento, numero_documento, peso, altura y país. La contraseña **no** se puede modificar por este endpoint.

**DELETE /api/usuarios/:id** → `204 No Content` si se elimina correctamente.

---

## 2. Instructor — `/api/instructor`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/instructor` | Registrar un nuevo instructor |

**POST /api/instructor**
```json
{
  "nombre": "Laura",
  "apellido": "Gómez",
  "experiencia": 3,
  "especialidad": "Fuerza",
  "correo": "laura@mail.com",
  "password": "Segura123"
}
```
Respuesta: `201 Created`. Si el correo ya está registrado → `409 Conflict` con `"Ya existe un instructor registrado con el correo..."`.

---

## 3. Disponibilidad — `/api/disponibilidad`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/disponibilidad` | Crear un bloque de disponibilidad |
| GET | `/api/disponibilidad/instructor/:idInstructor` | Listar la agenda completa de un instructor |
| PUT | `/api/disponibilidad/:id` | Actualizar un bloque existente |
| DELETE | `/api/disponibilidad/:id` | Eliminar un bloque |

**POST /api/disponibilidad**
```json
{ "idInstructor": 1, "diaSemana": "lunes", "horaInicio": "06:00", "horaFin": "10:00" }
```
Reglas de negocio:
- `horaFin` debe ser mayor que `horaInicio` → si no, `400 Bad Request`.
- No puede solaparse con otro bloque existente del mismo instructor y día → `409 Conflict`.

---

## 4. Reserva — `/api/reserva`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/reserva` | Crear una reserva |
| GET | `/api/reserva/usuario/:idUsuario` | Listar reservas de un usuario |
| GET | `/api/reserva/instructor/:idInstructor` | Listar reservas de un instructor |
| PATCH | `/api/reserva/:id/estado` | Cambiar el estado de una reserva |

**POST /api/reserva**
```json
{
  "idUsuario": 4, "idInstructor": 1, "idRutina": 1,
  "objetivo": "Ganar fuerza", "fecha": "2026-09-14",
  "horaInicio": "06:00", "horaFin": "07:00", "precio": 50000
}
```
Reglas de negocio:
- El horario debe caer dentro de un bloque `disponible` del instructor para ese día → si no, `409 Conflict` ("El instructor no tiene disponibilidad para ese día y horario.").
- No puede solaparse con otra reserva activa del mismo instructor → `409 Conflict`.

**PATCH /api/reserva/:id/estado**
```json
{ "estado": "confirmada" }
```
Estados válidos: `pendiente`, `confirmada`, `completada`, `cancelada`. No se puede modificar una reserva `completada` o `cancelada`, ni marcar `completada` una reserva cuya fecha/hora aún no ha pasado.

---

## 5. Rutinas — `/api/rutinas`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/rutinas` | Consultar todas las rutinas |
| GET | `/api/rutinas/:id` | Consultar una rutina por ID |
| POST | `/api/rutinas` | Crear una rutina |
| PUT | `/api/rutinas/:id` | Actualizar una rutina |
| DELETE | `/api/rutinas/:id` | Eliminar una rutina |

**POST /api/rutinas**
```json
{ "nombre_rutina": "Fuerza básica", "dificultad": "principiante", "duracion": 45 }
```

---

## 6. Seguimiento — `/api/seguimiento`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/seguimiento` | Listar seguimientos (admite filtros `?id_usuario=` y/o `?id_rutina=`) |
| GET | `/api/seguimiento/:id` | Consultar un seguimiento por ID |
| POST | `/api/seguimiento` | Registrar un seguimiento |
| PUT | `/api/seguimiento/:id` | Actualizar un seguimiento |
| DELETE | `/api/seguimiento/:id` | Eliminar un seguimiento |

**POST /api/seguimiento**
```json
{
  "id_usuario": 4, "id_rutina": 1, "fecha": "2026-09-27",
  "peso": 78.4, "porcentaje_grasa": 18.2, "masa_muscular": 71.5,
  "series_completadas": 4, "repeticiones_completadas": 48,
  "nivel_esfuerzo": "alto", "comentarios": "Buena sesión"
}
```
Solo `id_usuario` y `fecha` son obligatorios; el resto de campos son opcionales.

---

## 7. Mensaje — `/api/mensaje`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/mensaje` | Enviar un mensaje |
| GET | `/api/mensaje/conversacion/:idUsuario/:idInstructor` | Ver la conversación completa entre un usuario y un instructor |

**POST /api/mensaje**
```json
{ "idUsuario": 4, "idInstructor": 1, "remitente": "usuario", "contenido": "Hola, tengo una duda sobre mi rutina" }
```
`remitente` debe ser `"usuario"` o `"instructor"`.

---

## 8. Historial — `/api/historial`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/historial` | Crear un registro de progreso |
| GET | `/api/historial/usuario/:idUsuario` | Listar el historial de un usuario |

**POST /api/historial**
```json
{ "idUsuario": 4, "fecha": "2026-09-26", "registroProgreso": "Completé mi primera semana de rutina de fuerza" }
```

---

## 9. Pago — `/api/pago`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/pago` | Registrar (o reemplazar) el intento de pago de una reserva |
| GET | `/api/pago/reserva/:idReserva` | Consultar el pago de una reserva |
| PATCH | `/api/pago/reserva/:idReserva/estado` | Cambiar el estado del pago |

**POST /api/pago**
```json
{ "idReserva": 1, "monto": 50000, "metodoPago": "tarjeta" }
```
`metodoPago`: `efectivo`, `tarjeta`, `transferencia`, `otro`. **Regla de negocio:** `id_reserva` es único — un segundo intento de pago actualiza la fila existente en vez de crear una nueva.

**PATCH /api/pago/reserva/:idReserva/estado**
```json
{ "estado": "pagado", "referenciaExterna": "TRX-00123" }
```
`estado`: `pendiente`, `pagado`, `reembolsado`, `fallido`. Al marcar `pagado`, se registra automáticamente `fecha_pago`.

---

## 10. Calificación — `/api/calificacion`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/calificacion/usuario` | El usuario califica al instructor |
| POST | `/api/calificacion/instructor` | El instructor califica al usuario |
| GET | `/api/calificacion/reserva/:idReserva` | Consultar la calificación de una reserva |

**POST /api/calificacion/usuario** (igual para `/instructor`)
```json
{ "idReserva": 1, "puntuacion": 5, "comentario": "Excelente instructor, muy puntual" }
```
`puntuacion`: entero de 1 a 5. **Regla de negocio:** solo se puede calificar una reserva cuyo `estado` sea `completada` → si no, `409 Conflict`. Cada lado (usuario/instructor) actualiza su propia mitad de la misma fila (`id_reserva` es único).

---

## Códigos de estado HTTP usados

| Código | Significado en esta API |
|---|---|
| 200 | Consulta u operación exitosa |
| 201 | Recurso creado exitosamente |
| 204 | Eliminación exitosa (sin contenido en la respuesta) |
| 400 | Datos de entrada inválidos o incompletos |
| 401 | Credenciales incorrectas (login) |
| 404 | El recurso solicitado no existe |
| 409 | Conflicto con una regla de negocio (solapamiento, duplicado, estado inválido) |
| 500 | Error interno del servidor |
