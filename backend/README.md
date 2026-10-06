MuscleMind Backend

Backend del proyecto MuscleMind, una aplicación orientada a la promoción de hábitos saludables mediante la planificación y seguimiento de rutinas de entrenamiento personalizadas, con acompañamiento de instructores.

Repositorio

https://github.com/Sanlop22/Musclemind-1.3

Descripción

MuscleMind conecta usuarios con instructores de entrenamiento físico, permitiendo:

Gestión de usuarios e instructores.
Registro e inicio de sesión.
Consulta y administración de la disponibilidad horaria de los instructores.
Reserva de sesiones de entrenamiento.
Validación de disponibilidad y prevención de solapamientos.
Registro de rutinas de entrenamiento.
Seguimiento del progreso físico del usuario.
Mensajería entre usuario e instructor.
Consulta del historial.
Gestión de pagos asociados a las reservas.
Calificación de usuarios e instructores después de completar una sesión.

El backend expone una API REST desarrollada con Node.js y Express, conectada a una base de datos MySQL.

El proyecto utiliza una arquitectura modular por capas:

Routes → Validator → Controller → Service → Repository → MySQL

Esta estructura permite separar responsabilidades y facilitar el mantenimiento del sistema.

Tecnologías utilizadas
Node.js
Express.js
MySQL
MySQL2
express-validator
Bcrypt / bcryptjs
Dotenv
CORS
Git
GitHub
Visual Studio Code
Postman
MySQL Workbench
Arquitectura del proyecto
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middlewares/
│   │   └── error.middleware.js
│   │
│   ├── modules/
│   │   ├── users/
│   │   ├── instructor/
│   │   ├── disponibilidad/
│   │   ├── reserva/
│   │   ├── rutinas/
│   │   ├── seguimiento/
│   │   ├── mensaje/
│   │   ├── historial/
│   │   ├── pago/
│   │   └── calificacion/
│   │
│   └── app.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
Organización por capas

Cada módulo utiliza una estructura organizada por responsabilidades.

Archivo	Responsabilidad
*.routes.js	Define los endpoints y las rutas del módulo.
*.validator.js	Valida los datos recibidos en las solicitudes.
*.controller.js	Recibe la petición HTTP y genera la respuesta.
*.service.js	Contiene las reglas de negocio.
*.repository.js	Realiza las consultas a la base de datos MySQL.
*.model.js	Representa la información correspondiente a una entidad cuando aplica.

La comunicación entre módulos se realiza respetando la separación de responsabilidades.

Módulos desarrollados
Módulo	Descripción	Desarrollado por
users	Registro, consulta, actualización, eliminación e inicio de sesión de usuarios.	Sandra López
instructor	Registro, consulta e inicio de sesión de instructores.	Bárbara Jaramillo
disponibilidad	Gestión de horarios disponibles de los instructores.	Bárbara Jaramillo
reserva	Creación y gestión de reservas de entrenamiento.	Bárbara Jaramillo
mensaje	Mensajería entre usuario e instructor.	Bárbara Jaramillo
historial	Consulta del historial del usuario.	Bárbara Jaramillo
pago	Registro y actualización de pagos asociados a reservas.	Bárbara Jaramillo
calificacion	Calificación de usuarios e instructores.	Bárbara Jaramillo
rutinas	Catálogo de rutinas de entrenamiento.	Ronald Muñoz
seguimiento	Registro del progreso físico del usuario.	Ronald Muñoz
Reglas de negocio destacadas
Disponibilidad

No se pueden crear dos bloques horarios que se solapen para un mismo instructor y día.

Reserva

Una reserva solamente puede realizarse cuando:

El instructor tiene disponibilidad.
La fecha y hora solicitadas están dentro del horario disponible.
No existe otra reserva activa que se solape con el horario solicitado.
Estado de la reserva

Las reservas manejan diferentes estados, entre ellos:

pendiente
completada
cancelada

Una reserva completada o cancelada no puede modificarse como una reserva activa.

Pago

Cada reserva puede tener un registro de pago asociado.

El sistema permite registrar y actualizar el estado del pago.

Calificación

Una reserva debe encontrarse en estado completada para poder realizar una calificación.

El usuario puede calificar al instructor y el instructor puede calificar al usuario.

Seguridad

Las contraseñas de usuarios e instructores se almacenan mediante hash utilizando Bcrypt/bcryptjs, evitando almacenarlas directamente en texto plano.

El inicio de sesión compara la contraseña ingresada con el hash almacenado.

Mejora pendiente

El proyecto actualmente no implementa autenticación mediante tokens JWT.

La implementación de JWT se considera una mejora futura para aumentar la seguridad antes de un despliegue en producción.

Base de datos

El proyecto utiliza MySQL como sistema gestor de base de datos.

La conexión se administra mediante mysql2 y un pool de conexiones.

La configuración se encuentra en:

src/config/db.js

Las credenciales se manejan mediante variables de entorno.

Ejemplo:

DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=musclemind
DB_CONNECTION_LIMIT=10
PORT=3000

El archivo .env contiene información de configuración y no debe publicarse en GitHub cuando contiene credenciales reales.

API REST

El backend proporciona diferentes endpoints para la comunicación con el frontend.

Usuarios
GET    /api/usuarios
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
Instructores
GET  /api/instructor
POST /api/instructor
Disponibilidad
GET  /api/disponibilidad
POST /api/disponibilidad
Reservas
POST /api/reserva
GET  /api/reserva/usuario/:idUsuario
Rutinas
GET /api/rutinas
Seguimiento
GET  /api/seguimiento/usuario/:idUsuario
POST /api/seguimiento
Mensajes
GET  /api/mensaje/conversacion/:idUsuario/:idInstructor
POST /api/mensaje
Historial
GET /api/historial/usuario/:idUsuario
Pagos
POST  /api/pago
GET   /api/pago/reserva/:idReserva
PATCH /api/pago/reserva/:idReserva/estado
Calificaciones
POST /api/calificacion/usuario
POST /api/calificacion/instructor
GET  /api/calificacion/reserva/:idReserva
Flujo principal

El funcionamiento general del sistema se puede representar así:

Usuario
   ↓
Frontend React
   ↓
API REST
   ↓
Routes
   ↓
Validator
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL

El flujo funcional principal de MuscleMind es:

Rutinas
   ↓
Instructores
   ↓
Disponibilidad
   ↓
Reserva
   ↓
Mis Reservas
   ↓
Pago / Calificación
   ↓
Historial

También se encuentran disponibles los módulos de:

Seguimiento
Mensajes
Instalación y ejecución local
1. Clonar el repositorio
git clone https://github.com/Sanlop22/Musclemind-1.3.git
2. Entrar a la carpeta del backend
cd Musclemind-1.3/backend
3. Instalar dependencias
npm install
4. Configurar las variables de entorno

Crear el archivo:

.env

dentro de la carpeta backend.

Agregar las variables de conexión a MySQL.

5. Ejecutar el servidor
node index.js

El backend se ejecuta en:

http://localhost:3000
Pruebas de la API

Las funcionalidades del backend fueron probadas mediante solicitudes HTTP utilizando Postman y verificando los resultados en MySQL Workbench.

Se realizaron pruebas de:

Registro de usuarios.
Inicio de sesión.
Consulta de instructores.
Consulta de disponibilidad.
Creación de reservas.
Consulta de reservas.
Registro de pagos.
Actualización del estado de pagos.
Calificación de instructores.
Consulta de historial.
Registro de seguimiento.
Consulta y envío de mensajes.

También se verificaron reglas de negocio como disponibilidad, reservas y estados de las sesiones.

Integración con el Frontend

El backend se encuentra integrado con el frontend desarrollado en React.

La comunicación se realiza mediante solicitudes HTTP a la API REST.

El frontend consume principalmente los siguientes módulos:

Usuarios
Rutinas
Instructores
Disponibilidad
Reservas
Mis Reservas
Pagos
Calificaciones
Seguimiento
Historial
Mensajes
Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Rama principal:

main

Último commit de integración:

06fc770 - Integrar modulos principales de MuscleMind
Estado actual del proyecto

Actualmente se encuentran integrados los principales módulos del sistema:

users
instructor
disponibilidad
reserva
rutinas
seguimiento
mensaje
historial
pago
calificacion

El backend se encuentra conectado con el frontend y con la base de datos MySQL.

Mejoras futuras
Implementación de autenticación mediante JWT.
Fortalecimiento de las validaciones.
Mejoras de seguridad.
Integración con una pasarela de pagos real.
Mejoras adicionales en la gestión de usuarios y permisos.
Autores
Sandra López
Bárbara Jaramillo
Ronald Muñoz