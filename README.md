MuscleMind – Frontend

Repositorio

https://github.com/Sanlop22/Musclemind-1.3

Descripción

MuscleMind es una aplicación web orientada al entrenamiento físico, la selección de instructores y el seguimiento del progreso de los usuarios.

Este repositorio contiene el componente Frontend del proyecto, desarrollado con React y Vite.

El frontend permite a los usuarios interactuar con las diferentes funcionalidades de la aplicación, comunicarse con el backend mediante una API REST y acceder a las opciones disponibles según su rol.

La aplicación cuenta con mecanismos de autenticación mediante JWT y protección de rutas para controlar el acceso a las funcionalidades.

Tecnologías utilizadas

React

Vite

JavaScript

JSX

React Router DOM

HTML

CSS

Fetch API mediante el servicio centralizado apiFetch

JSON Web Token (JWT)

Git

GitHub

Visual Studio Code

Arquitectura del Frontend

El frontend utiliza una estructura organizada por páginas, componentes, servicios y utilidades.

El funcionamiento general es:

Usuario → React → Páginas → Servicios → apiFetch → API REST → Backend → MySQL

Esta organización permite separar la interfaz de usuario de la comunicación con el backend.

El servicio centralizado apiFetch se encarga de realizar las solicitudes HTTP y adjuntar el token JWT cuando corresponde.

Estructura principal

frontend/
│
├── src/
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Rutinas.jsx
│   │   ├── Instructores.jsx
│   │   ├── Reserva.jsx
│   │   ├── MisReservas.jsx
│   │   ├── ReservasInstructor.jsx
│   │   ├── Disponibilidad.jsx
│   │   ├── Pagos.jsx
│   │   ├── Calificaciones.jsx
│   │   ├── Seguimiento.jsx
│   │   ├── Historial.jsx
│   │   └── Mensajes.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── instructorService.js
│   │   ├── disponibilidadService.js
│   │   ├── reservaService.js
│   │   ├── mensajeService.js
│   │   ├── historialService.js
│   │   ├── pagoService.js
│   │   └── ...
│   │
│   ├── utils/
│   │   └── session.js
│   │
│   ├── App.jsx
│   └── ...
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

La estructura representa la organización general del frontend. Los nombres de los archivos corresponden a los módulos implementados y deben mantenerse sincronizados con el proyecto.

Funcionalidades principales

El frontend permite:

Registrar usuarios.

Iniciar y cerrar sesión.

Mantener la sesión mediante tokens JWT.

Consultar y seleccionar rutinas.

Consultar y seleccionar instructores.

Consultar la disponibilidad de los instructores.

Administrar la disponibilidad desde el perfil del instructor.

Realizar reservas de entrenamiento.

Consultar las reservas realizadas por los usuarios.

Consultar y gestionar las reservas desde el perfil del instructor.

Registrar y consultar pagos asociados a las reservas.

Calificar al instructor después de completar una reserva.

Registrar y consultar el seguimiento del progreso físico.

Consultar el historial de actividades.

Enviar y consultar mensajes entre usuarios e instructores.

Páginas principales

Inicio

Presenta la información general de MuscleMind y permite acceder a las principales funcionalidades de la aplicación.

Registro

Permite crear una nueva cuenta de usuario mediante el formulario de registro.

El frontend envía la información al backend, donde se realizan las validaciones correspondientes.

Inicio de sesión

Permite ingresar a la aplicación mediante las credenciales registradas.

Cuando el inicio de sesión es exitoso, el frontend recibe el token JWT y los datos del usuario, y almacena la información necesaria para mantener la sesión.

Rutinas

Permite consultar las rutinas de entrenamiento disponibles y seleccionar una para continuar con el proceso de selección del instructor.

Instructores

Permite consultar los instructores registrados y seleccionar uno para continuar con el proceso de reserva.

Disponibilidad

Permite al instructor administrar sus bloques horarios disponibles para las sesiones de entrenamiento.

La información se registra mediante el backend y se utiliza posteriormente para mostrar los horarios que pueden reservar los usuarios.

Reserva

Permite seleccionar una fecha y un horario disponible para realizar el entrenamiento con el instructor seleccionado.

El formulario envía la información al backend, donde se validan las condiciones de disponibilidad y las reglas de negocio de las reservas.

Mis Reservas

Permite al usuario consultar las reservas realizadas y visualizar su información y estado.

También permite acceder a las opciones disponibles según el estado de cada reserva.

Reservas del instructor

Permite al instructor consultar las reservas asociadas a su perfil y gestionar los estados de las sesiones de entrenamiento.

Pagos

Permite consultar y gestionar el registro de pago asociado a una reserva.

El frontend se comunica con el backend para registrar y consultar los pagos y actualizar sus estados.

Calificaciones

Permite realizar calificaciones entre usuarios e instructores después de completar una reserva.

Seguimiento

Permite registrar y consultar información relacionada con el progreso físico del usuario, incluyendo la fecha, la rutina realizada, el peso y los comentarios.

Historial

Permite consultar el historial de actividades y entrenamientos realizados por el usuario.

Mensajes

Permite establecer comunicación entre el usuario y el instructor mediante conversaciones.

Autenticación y protección de rutas

El frontend implementa mecanismos para mantener la sesión del usuario y controlar el acceso a las páginas internas.

Manejo de sesión

El archivo session.js contiene funciones para administrar la información de la sesión:

guardarSesion(): almacena los datos de la sesión.

obtenerUsuario(): obtiene la información del usuario autenticado.

haySesion(): verifica si existe una sesión.

cerrarSesion(): finaliza la sesión y elimina la información almacenada.

El token JWT se almacena en localStorage mediante la clave:

musclemind_token

Los datos del usuario se almacenan mediante la clave:

usuario

Protección de rutas

El componente RutaProtegida controla el acceso a las páginas que requieren autenticación.

Cuando una persona intenta ingresar a una página protegida sin una sesión válida, el frontend la redirige al inicio de sesión.

También se controla el acceso según el rol del usuario, evitando que usuarios e instructores accedan a funcionalidades que no les corresponden.

Comunicación autenticada

El servicio apiFetch centraliza las solicitudes HTTP al backend.

Entre sus responsabilidades se encuentran:

Construir las solicitudes a la API REST.

Enviar el encabezado de autorización cuando existe un token.

Enviar los datos de las solicitudes.

Procesar las respuestas del backend.

Permitir que los servicios de los diferentes módulos utilicen una misma lógica de comunicación.

El encabezado de autorización utilizado es:

Authorization: Bearer <token>

Rutas principales

El proyecto utiliza React Router DOM para controlar la navegación entre las diferentes páginas.

Entre las rutas principales se encuentran:

Ruta

Funcionalidad

/

Página de inicio

/login

Inicio de sesión

/register

Registro

/rutinas

Consulta de rutinas

/instructores

Consulta de instructores

/reserva

Creación de reservas

/misreservas

Reservas del usuario

/disponibilidad

Administración de disponibilidad del instructor

/pagos

Gestión de pagos

/calificaciones

Calificaciones

/seguimiento

Seguimiento físico

/historial

Historial

/mensajes

Mensajería

Las rutas internas están sujetas a las condiciones de autenticación y permisos definidas en el componente de protección de rutas.

Integración con el Backend

El frontend se comunica con el backend mediante solicitudes HTTP a través del servicio centralizado apiFetch.

Durante el desarrollo, el backend se encuentra disponible en:

http://localhost:3000

La URL de la API se configura mediante la variable de entorno:

VITE_API_URL=http://localhost:3000/api

El archivo frontend/.env.example contiene la configuración de ejemplo.

Algunos de los servicios utilizados por el frontend son:

/api/usuarios
/api/rutinas
/api/instructor
/api/disponibilidad
/api/reserva
/api/mensaje
/api/historial
/api/pago
/api/calificacion
/api/seguimiento

Cada módulo utiliza sus respectivos archivos de servicio para comunicarse con los endpoints del backend.

Manejo de errores

El frontend contempla el manejo de errores durante la comunicación con el backend.

Cuando una solicitud no puede completarse, la interfaz presenta mensajes para informar al usuario sobre la situación.

Entre los escenarios contemplados se encuentran:

Credenciales incorrectas durante el inicio de sesión.

Datos inválidos durante el registro.

Sesión no válida o token vencido.

Acceso no autorizado a una funcionalidad.

Información no encontrada.

Horarios no disponibles.

Conflictos durante la creación de reservas.

Pagos que ya tienen un registro asociado.

Errores de comunicación con el servidor.

También se verifica el comportamiento de la interfaz cuando el backend deja de estar disponible, evitando que los errores de conexión se presenten como operaciones exitosas.

Flujo principal de la aplicación

El flujo funcional principal de MuscleMind es:

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

Adicionalmente, el usuario puede utilizar:

Seguimiento del progreso físico.

Mensajes con los instructores.

El instructor también cuenta con funcionalidades para administrar su disponibilidad y consultar y gestionar sus reservas.

Instalación

Para utilizar el frontend se debe clonar el repositorio:

git clone https://github.com/Sanlop22/Musclemind-1.3.git

Ingresar a la carpeta del frontend:

cd Musclemind-1.3/frontend

Instalar las dependencias:

npm install

Configurar la URL de la API:

Copiar frontend/.env.example como frontend/.env.

La configuración inicial es:

VITE_API_URL=http://localhost:3000/api

Ejecución del Frontend

Para iniciar el servidor de desarrollo:

npm run dev

Vite mostrará en la terminal la dirección local disponible para acceder a la aplicación.

Generalmente se encuentra disponible en:

http://localhost:5173

Ejecución completa del proyecto

Para utilizar MuscleMind correctamente se deben ejecutar el backend y el frontend.

Backend

Desde la carpeta:

Musclemind-1.3/backend

Instalar las dependencias:

npm install

Configurar el archivo .env con los datos de conexión a MySQL y la clave JWT.

Ejecutar:

npm run dev

El backend utiliza:

http://localhost:3000

Frontend

Desde otra terminal, ingresar a:

Musclemind-1.3/frontend

Instalar las dependencias si todavía no están instaladas:

npm install

Ejecutar:

npm run dev

El frontend se conecta al backend mediante la API REST.

Antes de iniciar el proyecto por primera vez se debe:

Crear la base de datos ejecutando backend/sql/schema.sql en MySQL Workbench.

Copiar backend/.env.example como backend/.env.

Completar las credenciales de conexión a MySQL y configurar JWT_SECRET.

Copiar frontend/.env.example como frontend/.env.

Verificar que el backend y la base de datos estén funcionando.

Para utilizar las páginas internas es necesario registrarse e iniciar sesión.

Pruebas

Durante el desarrollo se realizaron pruebas de las diferentes funcionalidades mediante la navegación por la aplicación, la comunicación con el backend y la verificación de los datos en MySQL Workbench y Postman.

Entre las pruebas realizadas y contempladas se encuentran:

Navegación entre páginas.

Registro de usuarios.

Validación de datos de registro.

Inicio y cierre de sesión.

Almacenamiento y envío del token JWT.

Protección de rutas.

Acceso a funcionalidades según el rol.

Consulta de rutinas.

Selección de instructores.

Consulta de disponibilidad.

Administración de horarios del instructor.

Creación y consulta de reservas.

Gestión de reservas por parte del instructor.

Registro y consulta de pagos.

Control de pagos asociados a una misma reserva.

Calificación de instructores y usuarios.

Consulta del historial.

Registro y consulta de seguimiento.

Envío y consulta de mensajes.

Manejo de errores de comunicación con el backend.

También se verifica la comunicación entre:

Frontend → API REST → Backend → MySQL

Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones y el seguimiento de los cambios realizados durante el desarrollo.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Rama principal:

main

Los avances y modificaciones se registran mediante commits y se integran en el repositorio remoto.

Estado actual del proyecto

El frontend se encuentra integrado con el backend y permite navegar por los principales módulos funcionales de MuscleMind.

Actualmente se encuentran integradas las siguientes funcionalidades:

Registro e inicio de sesión.

Autenticación JWT.

Protección de rutas y control de roles.

Usuarios e instructores.

Rutinas.

Disponibilidad.

Reservas de usuarios.

Gestión de reservas de instructores.

Pagos.

Calificaciones.

Seguimiento.

Historial.

Mensajes.

La aplicación se comunica con el backend mediante una API REST y utiliza MySQL para el almacenamiento de la información.

Mejoras futuras

Mejoras adicionales en la experiencia de usuario.

Ampliación de las pruebas automatizadas del frontend.

Optimización de la interfaz para diferentes dispositivos.

Mejoras en los reportes y visualización del progreso físico.

Integración con una pasarela de pagos real.

Preparación de la aplicación para su despliegue en producción.

Autores

Sandra López

Bárbara Jaramillo

Ronald Muñoz

