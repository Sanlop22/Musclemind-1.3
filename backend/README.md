Backend del proyecto MuscleMind, una aplicación web orientada a la promoción de hábitos saludables mediante la planificación y el seguimiento de rutinas de entrenamiento personalizadas, con acompañamiento de instructores.

Repositorio

https://github.com/Sanlop22/Musclemind-1.3

Descripción del proyecto

MuscleMind conecta usuarios con instructores de entrenamiento físico, permitiendo:

Registro e inicio de sesión de usuarios e instructores.

Autenticación mediante tokens JWT.

Control de acceso según los roles de usuario e instructor.

Consulta y administración de la disponibilidad horaria de los instructores.

Reserva de sesiones de entrenamiento.

Validación de disponibilidad y prevención de reservas solapadas.

Consulta y administración de rutinas de entrenamiento.

Seguimiento del progreso físico del usuario.

Mensajería entre usuarios e instructores.

Consulta del historial de actividades.

Gestión de pagos asociados a las reservas.

Calificación de usuarios e instructores después de completar una sesión.

El backend expone una API REST desarrollada con Node.js y Express, conectada a una base de datos MySQL.

El proyecto utiliza una arquitectura modular por capas:

Routes → Validator → Controller → Service → Repository → MySQL

Esta estructura permite separar responsabilidades, facilitar el mantenimiento y mejorar la organización del código.

Tecnologías utilizadas

Tecnología

Uso

Node.js

Entorno de ejecución del backend

Express.js

Desarrollo de la API REST

MySQL

Sistema gestor de base de datos

MySQL2

Conexión y consultas a MySQL

express-validator

Validación de datos

Bcrypt / bcryptjs

Cifrado hash de contraseñas

JSON Web Token (JWT)

Autenticación y autorización

Dotenv

Manejo de variables de entorno

CORS

Control de acceso entre frontend y backend

React

Desarrollo del frontend

Vite

Entorno de desarrollo del frontend

Git y GitHub

Control de versiones

Visual Studio Code

Entorno de desarrollo

Postman

Pruebas de la API REST

MySQL Workbench

Administración y consulta de la base de datos

Arquitectura del proyecto

El backend está organizado en módulos y capas para facilitar el desarrollo y mantenimiento de las funcionalidades.

backend/
│
├── src/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── permisos.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── modules/
│   │   ├── usuarios/
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
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md

La estructura representa la organización general del backend. Cada módulo contiene los archivos correspondientes a las responsabilidades que necesita.

Organización por capas

Archivo

Responsabilidad

*.routes.js

Define los endpoints y las rutas del módulo.

*.validator.js

Valida los datos recibidos en las solicitudes.

*.controller.js

Recibe las peticiones HTTP y genera las respuestas.

*.service.js

Contiene las reglas de negocio.

*.repository.js

Realiza las consultas a la base de datos MySQL.

*.model.js

Representa la información de una entidad cuando aplica.

Módulos desarrollados

Módulo

Descripción

Desarrollado por

usuarios

Registro, consulta, actualización, eliminación e inicio de sesión de usuarios.

Sandra López

instructor

Registro, consulta e inicio de sesión de instructores.

Bárbara Jaramillo

disponibilidad

Gestión de horarios disponibles de los instructores.

Bárbara Jaramillo

reserva

Creación, consulta y gestión de reservas de entrenamiento.

Bárbara Jaramillo

mensaje

Mensajería entre usuarios e instructores.

Bárbara Jaramillo

historial

Consulta del historial del usuario.

Bárbara Jaramillo

pago

Registro y actualización de pagos asociados a reservas.

Bárbara Jaramillo

calificacion

Calificación de usuarios e instructores.

Bárbara Jaramillo

rutinas

Catálogo y consulta de rutinas de entrenamiento.

Ronald Muñoz

seguimiento

Registro y consulta del progreso físico del usuario.

Ronald Muñoz

Seguridad y autenticación

El sistema implementa autenticación mediante JSON Web Token (JWT).

Inicio de sesión

Cuando un usuario o instructor inicia sesión correctamente, el backend genera un token JWT que permite identificar su sesión.

El frontend almacena el token y lo envía en las solicitudes protegidas mediante el encabezado:

Authorization: Bearer <token>

Middleware de autenticación

El middleware auth.middleware.js verifica la validez del token recibido.

Cuando la solicitud no contiene un token válido, el sistema responde con un error de autenticación HTTP 401.

Control de permisos

El middleware permisos.middleware.js permite controlar el acceso a las funcionalidades según el rol del usuario autenticado.

El sistema diferencia los permisos de usuarios e instructores y obtiene la identidad correspondiente desde el token, evitando depender de identificadores enviados libremente en el cuerpo de las solicitudes.

Protección de contraseñas

Las contraseñas se almacenan utilizando Bcrypt/bcryptjs mediante funciones hash.

El sistema compara la contraseña ingresada durante el inicio de sesión con el hash almacenado en MySQL. No se guardan contraseñas directamente en texto plano.

Reglas de negocio implementadas

Disponibilidad

Un instructor puede registrar sus bloques de disponibilidad.

No se deben crear bloques horarios que se solapen para un mismo instructor y día.

La consulta de disponibilidad permite identificar los horarios habilitados para reservar.

Reserva

Una reserva solamente puede realizarse cuando:

El instructor tiene disponibilidad registrada.

La fecha y hora solicitadas se encuentran dentro del horario disponible.

No existe otra reserva activa que se solape con el horario solicitado.

La información enviada cumple las validaciones establecidas.

Se implementaron controles para evitar conflictos cuando se realizan solicitudes de reserva simultáneas, utilizando operaciones de base de datos y bloqueos durante el proceso de creación.

Estados de las reservas

Las reservas manejan estados como:

pendiente

completada

cancelada

El sistema controla las modificaciones según el estado de la reserva.

Pagos

Cada reserva puede tener un registro de pago asociado.

Se implementaron controles para evitar la creación de múltiples registros de pago para una misma reserva.

La relación entre pago y reserva permite identificar si ya existe un registro y controlar los intentos posteriores de procesamiento.

El sistema permite consultar el pago y actualizar su estado.

Nota: el módulo administra los registros y estados de pago, pero no representa una integración con una pasarela bancaria real.

Calificaciones

Una reserva debe encontrarse en estado completada para permitir una calificación.

El usuario puede calificar al instructor.

El instructor puede calificar al usuario.

Las calificaciones se relacionan con la reserva correspondiente.

Base de datos

El proyecto utiliza MySQL como sistema gestor de base de datos.

La conexión se administra mediante MySQL2 y un pool de conexiones.

La configuración se maneja mediante variables de entorno.

Ejemplo de configuración:

DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=musclemind
DB_CONNECTION_LIMIT=10
PORT=3000
JWT_SECRET=una_clave_larga_y_secreta
JWT_EXPIRES_IN=8h

El archivo backend/.env.example contiene las variables necesarias para configurar el entorno.

Para iniciar el proyecto:

Copiar .env.example.

Crear el archivo .env dentro de la carpeta backend.

Completar los valores correspondientes a la conexión de MySQL y la autenticación JWT.

El archivo .env contiene información de configuración y no debe publicarse en GitHub cuando incluye credenciales reales.

Estructura de la base de datos

La estructura de las tablas se encuentra en:

backend/sql/schema.sql

Para crear la base de datos se debe abrir el archivo en MySQL Workbench y ejecutar el script.

Si se utiliza una base de datos creada con una versión anterior del proyecto, se debe revisar si corresponde ejecutar el script de migración:

backend/sql/migracion_usuario_instructor.sql

La migración debe ejecutarse solamente cuando corresponda a la versión de la base de datos existente.

API REST

El backend proporciona endpoints para la comunicación con el frontend.

Las solicitudes a rutas protegidas deben incluir el encabezado de autorización JWT.

Usuarios

Método

Endpoint

Funcionalidad

GET

/api/usuarios

Consultar usuarios.

POST

/api/usuarios

Registrar usuario.

PUT

/api/usuarios/:id

Actualizar usuario.

DELETE

/api/usuarios/:id

Eliminar usuario.

POST

/api/usuarios/login

Iniciar sesión.

Instructores

Método

Endpoint

Funcionalidad

GET

/api/instructor

Consultar instructores.

POST

/api/instructor

Registrar instructor.

Disponibilidad

Método

Endpoint

Funcionalidad

GET

/api/disponibilidad

Consultar disponibilidad.

POST

/api/disponibilidad

Registrar disponibilidad.

Reservas

Método

Endpoint

Funcionalidad

POST

/api/reserva

Crear reserva.

GET

/api/reserva/usuario/:idUsuario

Consultar reservas de un usuario.

GET

/api/reserva/instructor/:idInstructor

Consultar reservas de un instructor.

Rutinas

Método

Endpoint

Funcionalidad

GET

/api/rutinas

Consultar rutinas disponibles.

Seguimiento

Método

Endpoint

Funcionalidad

GET

/api/seguimiento

Consultar registros de seguimiento del usuario autenticado.

POST

/api/seguimiento

Registrar seguimiento.

Mensajes

Método

Endpoint

Funcionalidad

GET

/api/mensaje/conversacion/:idUsuario/:idInstructor

Consultar conversación.

POST

/api/mensaje

Enviar mensaje.

Historial

Método

Endpoint

Funcionalidad

GET

/api/historial/usuario/:idUsuario

Consultar historial del usuario.

Pagos

Método

Endpoint

Funcionalidad

POST

/api/pago

Registrar pago.

GET

/api/pago/reserva/:idReserva

Consultar pago de una reserva.

PATCH

/api/pago/reserva/:idReserva/estado

Actualizar estado del pago.

Calificaciones

Método

Endpoint

Funcionalidad

POST

/api/calificacion/usuario

Calificar usuario.

POST

/api/calificacion/instructor

Calificar instructor.

GET

/api/calificacion/reserva/:idReserva

Consultar calificaciones de una reserva.

Los endpoints anteriores describen las operaciones principales. Para consultar todas las rutas, los parámetros y los permisos específicos se debe revisar la implementación de cada archivo *.routes.js y la documentación técnica del backend.

Integración con el frontend

MuscleMind cuenta con un frontend desarrollado en React y Vite.

La comunicación entre frontend y backend se realiza mediante solicitudes HTTP a la API REST.

El frontend consume los módulos de:

Usuarios.

Instructores.

Rutinas.

Disponibilidad.

Reservas y mis reservas.

Seguimiento.

Historial.

Mensajes.

Pagos.

Calificaciones.

Se implementó un servicio centralizado de comunicación con la API (apiFetch), encargado de realizar las solicitudes y adjuntar el token JWT cuando corresponde.

También se cuenta con mecanismos de protección de rutas para restringir el acceso a las páginas según la sesión y el rol del usuario.

Manejo de errores

El sistema contempla el manejo de errores provenientes del backend y de las solicitudes HTTP.

El frontend presenta mensajes cuando una operación no puede completarse, por ejemplo:

Sesión no válida o token vencido.

Datos de registro incorrectos.

Información no encontrada.

Conflictos en la disponibilidad de un instructor.

Reservas que no cumplen las reglas de negocio.

Pagos que ya tienen un registro asociado.

Errores de conexión con el servidor.

Cuando el backend no está disponible, el frontend debe informar el problema de comunicación sin mostrar información técnica innecesaria al usuario.

Pruebas de la API

Las funcionalidades del backend se verifican mediante solicitudes HTTP utilizando Postman y comprobaciones de los datos en MySQL Workbench.

Entre las pruebas realizadas y contempladas se encuentran:

Registro de usuarios.

Validación de correos electrónicos duplicados.

Inicio de sesión.

Verificación de autenticación mediante JWT.

Acceso a rutas protegidas con y sin token.

Consulta de rutinas.

Consulta de información inexistente.

Consulta de instructores.

Consulta de disponibilidad.

Creación y consulta de reservas.

Validación de horarios y prevención de solapamientos.

Registro y consulta de pagos.

Control de intentos repetidos de pago.

Actualización de estados.

Calificación de usuarios e instructores.

Consulta del historial.

Registro y consulta de seguimiento.

Envío y consulta de mensajes.

También se verifica que los errores controlados se presenten adecuadamente y que el servidor pueda continuar atendiendo solicitudes después de una operación fallida.

Las pruebas deben documentarse con su método HTTP, endpoint, datos de entrada, resultado esperado, resultado obtenido y código de respuesta.

Flujo principal del sistema

El funcionamiento técnico general se representa así:

Usuario
   ↓
Frontend React
   ↓
API REST
   ↓
Routes
   ↓
Middleware de autenticación y permisos
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

El flujo funcional principal es:

Registro / Inicio de sesión
          ↓
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

También se encuentran disponibles las funcionalidades de seguimiento del progreso físico y mensajería entre usuarios e instructores.

Instalación y ejecución local

1. Clonar el repositorio

git clone https://github.com/Sanlop22/Musclemind-1.3.git

2. Entrar a la carpeta del backend

cd Musclemind-1.3/backend

3. Instalar dependencias

npm install

4. Configurar las variables de entorno

Crear el archivo .env a partir de .env.example y completar los datos de conexión a MySQL y la clave JWT.

5. Configurar la base de datos

Crear la base de datos utilizando el script correspondiente de la carpeta backend/sql.

6. Ejecutar el backend

npm run dev

El backend se ejecuta localmente en:

http://localhost:3000

7. Ejecutar el frontend

Abrir una segunda terminal y entrar a la carpeta del frontend:

cd frontend

Instalar las dependencias:

npm install

Ejecutar el servidor de desarrollo:

npm run dev

El frontend se ejecuta localmente en:

http://localhost:5173

Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones y la integración de los cambios realizados por los integrantes.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Rama principal:

main

Los cambios se integran mediante commits y actualizaciones del repositorio remoto.

Estado actual del proyecto

MuscleMind cuenta con los principales módulos funcionales integrados:

Usuarios e instructores.

Autenticación JWT y control de permisos.

Disponibilidad.

Reservas.

Rutinas.

Seguimiento.

Historial.

Mensajes.

Pagos.

Calificaciones.

El backend se encuentra integrado con el frontend desarrollado en React y con la base de datos MySQL.

Se han realizado ajustes en la seguridad de las solicitudes, las reglas de negocio de reservas y pagos, la comunicación entre frontend y backend y el manejo de errores.

Mejoras futuras

Integración con una pasarela de pagos real.

Ampliación de las pruebas automatizadas.

Fortalecimiento continuo de las validaciones.

Mejoras en los reportes de progreso físico.

Optimización de la experiencia de usuario.

Preparación del sistema para un despliegue en producción.

Autores

Sandra López

Bárbara Jaramillo

Ronald Muñoz