## Repositorio
https://github.com/Sanlop22/Musclemind-1.3

# MuscleMind Backend

Backend del proyecto **MuscleMind**, una aplicación orientada a la promoción de hábitos saludables mediante la planificación y seguimiento de rutinas de entrenamiento personalizadas, con acompañamiento de instructores certificados.

## Descripción

MuscleMind conecta usuarios con instructores de entrenamiento físico, permitiendo:

- Gestión de usuarios e instructores (registro, autenticación).
- Consulta y administración de la disponibilidad horaria de los instructores.
- Reserva de sesiones de entrenamiento, validando disponibilidad y evitando solapamientos.
- Registro de rutinas de entrenamiento y seguimiento del progreso físico del usuario.
- Mensajería directa entre usuario e instructor.
- Historial de progreso personal del usuario.
- Gestión de pagos asociados a cada reserva.
- Calificación mutua entre usuario e instructor al finalizar una sesión.

El backend expone una **API REST** desarrollada con Node.js y Express, conectada a una base de datos MySQL, siguiendo una **arquitectura modular por capas** (rutas → validador → controlador → servicio → repositorio) para separar responsabilidades y facilitar el mantenimiento.

## Tecnologías utilizadas

- Node.js
- Express.js
- MySQL
- MySQL2 (con pool de conexiones)
- express-validator
- Bcrypt / bcryptjs
- Dotenv
- CORS
- Git y GitHub
- Visual Studio Code
- Postman
- MySQL Workbench

## Arquitectura del proyecto

Cada módulo del sistema sigue la misma estructura de capas, replicable y consistente en todo el proyecto:

```
backend/
│
├── src/
│   ├── database/
│   │   └── connection.js          # Pool de conexiones a MySQL
│   │
│   ├── middlewares/
│   │   └── error.middleware.js    # Manejo centralizado de errores
│   │
│   ├── modules/
│   │   ├── users/                 # Usuarios: CRUD + autenticación
│   │   ├── instructor/            # Instructores: CRUD + autenticación
│   │   ├── disponibilidad/        # Bloques horarios de instructores
│   │   ├── reserva/               # Reservas de sesiones de entrenamiento
│   │   ├── rutinas/               # Catálogo de rutinas de entrenamiento
│   │   ├── seguimiento/           # Seguimiento físico del usuario por rutina
│   │   ├── mensaje/               # Mensajería usuario ↔ instructor
│   │   ├── historial/             # Historial de progreso del usuario
│   │   ├── pago/                  # Pagos asociados a una reserva
│   │   └── calificacion/          # Calificación mutua usuario ↔ instructor
│   │
│   └── app.js                     # Configuración de Express y registro de rutas
│
├── .env                           # Variables de entorno (no se sube a git)
├── .gitignore
├── index.js                       # Punto de entrada del servidor
├── package.json
├── package-lock.json
└── README.md
```

Cada módulo, salvo excepciones puntuales, contiene:

| Archivo | Responsabilidad |
|---|---|
| `*.routes.js` | Define los endpoints y qué middlewares/controladores usa cada uno |
| `*.validator.js` | Valida la forma de los datos de entrada (tipos, obligatoriedad, longitudes) |
| `*.controller.js` | Recibe la petición HTTP, delega al service y responde |
| `*.service.js` | Contiene las reglas de negocio del módulo |
| `*.repository.js` | Única capa que ejecuta consultas SQL contra MySQL |
| `*.model.js` | Representa una fila de la tabla correspondiente |

Regla de dependencia entre módulos: **un módulo solo puede llamar al Service de otro módulo, nunca a su Repository directamente** (por ejemplo, `reserva` consulta la disponibilidad de un instructor a través de `disponibilidadService`, no accediendo a su tabla).

## Módulos desarrollados

| Módulo | Descripción | Desarrollado por |
|---|---|---|
| `users` | Registro, consulta, actualización, eliminación e inicio de sesión de usuarios | Sandra López |
| `instructor` | Registro, consulta e inicio de sesión de instructores | Bárbara Jaramillo |
| `disponibilidad` | Bloques horarios en los que un instructor está disponible, con validación de solapamientos | Bárbara Jaramillo |
| `reserva` | Reserva de sesiones, validando disponibilidad del instructor y evitando solapamientos con otras reservas | Bárbara Jaramillo |
| `mensaje` | Mensajería directa entre un usuario y un instructor | Bárbara Jaramillo |
| `historial` | Registro de progreso personal del usuario | Bárbara Jaramillo |
| `pago` | Registro y actualización del pago asociado a una reserva | Bárbara Jaramillo |
| `calificacion` | Calificación mutua (usuario → instructor e instructor → usuario) al completar una reserva | Bárbara Jaramillo |
| `rutinas` | Catálogo de rutinas de entrenamiento disponibles | Ronald Muñoz |
| `seguimiento` | Registro del progreso físico del usuario durante una rutina (peso, % grasa, series, etc.) | Ronald Muñoz |

> La documentación detallada de cada endpoint (método HTTP, parámetros, ejemplos de solicitud y respuesta) está en [`API_ENDPOINTS.md`](./API_ENDPOINTS.md).

## Reglas de negocio destacadas

- **Disponibilidad:** no se pueden crear dos bloques horarios que se solapen para un mismo instructor, el mismo día.
- **Reserva:** solo puede crearse si el horario solicitado cae dentro de un bloque de disponibilidad del instructor, y no se solapa con otra reserva activa del mismo instructor.
- **Cambio de estado de reserva:** una reserva no puede modificarse una vez está `completada` o `cancelada`; y no puede marcarse `completada` si la fecha/hora aún no ha pasado.
- **Pago:** cada reserva tiene, como máximo, un único registro de pago (`id_reserva` es `UNIQUE`). Un nuevo intento de pago actualiza la fila existente en vez de crear una nueva.
- **Calificación:** solo puede calificarse una reserva cuyo estado sea `completada`. El usuario y el instructor califican de forma independiente sobre la misma fila (`id_reserva` también es `UNIQUE`).

## Seguridad

- Las contraseñas de usuarios e instructores se almacenan como **hash** (Bcrypt/bcryptjs), nunca en texto plano.
- El inicio de sesión compara la contraseña ingresada contra el hash almacenado, sin exponer la contraseña real en ninguna respuesta.
- **Pendiente:** el proyecto todavía no implementa autenticación basada en tokens (JWT). Actualmente, los identificadores de usuario/instructor se reciben directamente en el cuerpo de la petición. Este es el próximo paso de seguridad recomendado antes de un despliegue en producción.

## Base de datos

El proyecto utiliza **MySQL**. La conexión se administra mediante un *pool de conexiones* (`mysql2`), configurado en `src/database/connection.js` y alimentado por variables de entorno:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=musclemind
DB_CONNECTION_LIMIT=10
PORT=3000
```

El archivo `.env` **no se sube al repositorio** (está en `.gitignore`).

## Instalación y ejecución local

1. Clonar el repositorio:
   ```
   git clone https://github.com/Sanlop22/Musclemind-1.3.git
   ```
2. Entrar a la carpeta del backend (**importante:** el proyecto real vive dentro de `backend/`, no en la raíz del repositorio):
   ```
   cd Musclemind-1.3/backend
   ```
3. Instalar las dependencias:
   ```
   npm install
   ```
4. Crear el archivo `.env` en `backend/` con los datos de conexión a MySQL (ver sección anterior).
5. Ejecutar el servidor:
   ```
   node index.js
   ```
   El servidor queda disponible en `http://localhost:3000`.

## Pruebas de la API

Las pruebas funcionales de todos los endpoints se realizaron manualmente con **Postman** y verificando los resultados directamente en **MySQL Workbench**, cubriendo tanto los casos exitosos como los casos de error de cada regla de negocio (por ejemplo: solapamiento de horarios, reserva fuera de disponibilidad, calificación de una reserva no completada, etc.).

## Control de versiones

El proyecto utiliza Git para el control de versiones y GitHub como repositorio remoto, con un flujo de trabajo basado en ramas por funcionalidad (`feature/...`) y Pull Requests hacia `main`.

Repositorio: https://github.com/Sanlop22/Musclemind-1.3

## Estado del proyecto

Actualmente se encuentran implementados y probados los 10 módulos backend del sistema: `users`, `instructor`, `disponibilidad`, `reserva`, `rutinas`, `seguimiento`, `mensaje`, `historial`, `pago` y `calificacion`.

Pendientes conocidos:
- Autenticación basada en JWT.
- Validación de entrada (`express-validator`) en los módulos `rutinas` y `seguimiento`.
- Integración completa del frontend con la API.

## Autores

- Sandra López
- Bárbara Jaramillo
- Ronald Muñoz
