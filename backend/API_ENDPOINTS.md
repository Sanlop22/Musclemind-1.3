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

## Autenticación y autorización

La API usa **JWT**. Casi todos los endpoints requieren iniciar sesión:

1. `POST /api/usuarios/login` devuelve un `token`.
2. En cada petición se envía el encabezado `Authorization: Bearer <token>`.
3. El token dura `JWT_EXPIRES_IN` (por defecto 8 horas). Si falta, es inválido o venció → `401 Unauthorized`.
4. Si el usuario está autenticado pero no tiene permiso sobre ese recurso → `403 Forbidden`.

**El usuario autenticado sale del token, no del cliente.** Los endpoints de reservas, mensajes, historial, pagos, calificaciones, rutinas y seguimiento ignoran cualquier `idUsuario`/`id_usuario`/`idInstructor`/`remitente` enviado en el body y usan los datos del token.

Roles: `usuario`, `instructor` y `admin` (este último solo se asigna directamente en la base de datos; el registro público solo admite `usuario` e `instructor`).

| Módulo | Quién puede usarlo |
|---|---|
| Usuarios | Registro y login públicos. Ver/editar/eliminar una cuenta: solo su dueño (el admin puede ver/eliminar). Listar todos: solo `admin`. |
| Instructor | `GET` con sesión iniciada. |
| Disponibilidad | Consultar agenda: cualquier sesión. Crear/editar/eliminar: solo el `instructor` dueño del bloque. |
| Reserva | Crear: `usuario`. Ver las de un usuario: el mismo usuario. Ver las de un instructor: ese instructor. Cambiar estado: participantes de la reserva (el usuario solo puede `cancelada`). |
| Rutinas / Seguimiento / Historial | Solo el dueño de cada registro. Las rutinas generales (sin dueño) se pueden consultar pero no modificar. |
| Mensaje | Solo los dos participantes de la conversación. |
| Pago / Calificación | Solo quienes participan en la reserva. |

Ninguna respuesta de la API incluye el campo `contrasena` (ni siquiera cifrado).

---

## 1. Usuarios — `/api/usuarios`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Consultar todos los usuarios (solo `admin`) |
| GET | `/api/usuarios/:id` | Consultar un usuario por ID (su dueño o `admin`) |
| POST | `/api/usuarios` | Registrar un nuevo usuario o instructor (público) |
| POST | `/api/usuarios/login` | Iniciar sesión (público) |
| PUT | `/api/usuarios/:id` | Actualizar un usuario (solo su dueño) |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario (su dueño o `admin`) |

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
  "contrasena": "123456",
  "rol": "usuario"
}
```
`rol` es opcional (`usuario` por defecto); para registrar un instructor se envía `"rol": "instructor"` junto con `experiencia` y `especialidad`, y se crea también su registro de instructor. La contraseña debe tener mínimo 6 caracteres. Respuesta: `201 Created` con el usuario creado (sin la contraseña).

**POST /api/usuarios/login**
```json
{ "correo": "sandra.prueba888@gmail.com", "contrasena": "123456" }
```
Respuesta exitosa (`200 OK`):
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token": "<JWT>",
  "usuario": { "id_usuario": 1, "nombre": "Sandra", "apellido": "Prueba", "correo": "sandra.prueba888@gmail.com", "rol": "usuario", "id_instructor": null }
}
```
Credenciales incorrectas → `401 Unauthorized`. Campos faltantes → `400 Bad Request`.

**PUT /api/usuarios/:id** — actualiza nombre, apellido, edad, tipo_documento, numero_documento, peso, altura y país. La contraseña **no** se puede modificar por este endpoint.

**DELETE /api/usuarios/:id** → `204 No Content` si se elimina correctamente.

---

## 2. Instructor — `/api/instructor`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/instructor` | Listar los instructores (requiere sesión iniciada) |

Los instructores ya **no** se crean por este módulo: se registran con `POST /api/usuarios` enviando `"rol": "instructor"`.

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
{ "diaSemana": "lunes", "horaInicio": "06:00", "horaFin": "10:00" }
```
El instructor se toma del token. Reglas de negocio:
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
  "idInstructor": 1, "idRutina": 1,
  "objetivo": "Ganar fuerza", "fecha": "2026-09-14",
  "horaInicio": "06:00", "horaFin": "07:00", "precio": 50000
}
```
El usuario se toma del token. Reglas de negocio:
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
| GET | `/api/seguimiento` | Listar los seguimientos del usuario autenticado (admite el filtro `?id_rutina=`) |
| GET | `/api/seguimiento/:id` | Consultar un seguimiento por ID |
| POST | `/api/seguimiento` | Registrar un seguimiento |
| PUT | `/api/seguimiento/:id` | Actualizar un seguimiento |
| DELETE | `/api/seguimiento/:id` | Eliminar un seguimiento |

**POST /api/seguimiento**
```json
{
  "id_rutina": 1, "fecha": "2026-09-27",
  "peso": 78.4, "porcentaje_grasa": 18.2, "masa_muscular": 71.5,
  "series_completadas": 4, "repeticiones_completadas": 48,
  "nivel_esfuerzo": "alto", "comentarios": "Buena sesión"
}
```
`id_rutina` y `fecha` son obligatorios; el resto es opcional. El `id_usuario` se toma del token.

---

## 7. Mensaje — `/api/mensaje`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/mensaje` | Enviar un mensaje |
| GET | `/api/mensaje/conversacion/:idUsuario/:idInstructor` | Ver la conversación completa entre un usuario y un instructor |

**POST /api/mensaje**
```json
{ "idInstructor": 1, "contenido": "Hola, tengo una duda sobre mi rutina" }
```
El remitente y el usuario/instructor de la conversación se toman del token: si escribe un instructor, debe enviar `idUsuario` (el cliente con quien conversa); si escribe un usuario, `idInstructor`.

---

## 8. Historial — `/api/historial`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/historial` | Crear un registro de progreso |
| GET | `/api/historial/usuario/:idUsuario` | Listar el historial de un usuario |

**POST /api/historial**
```json
{ "fecha": "2026-09-26", "registroProgreso": "Completé mi primera semana de rutina de fuerza" }
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
