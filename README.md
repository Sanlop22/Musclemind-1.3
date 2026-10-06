MuscleMind – Frontend
Repositorio

https://github.com/Sanlop22/Musclemind-1.3

Descripción

MuscleMind es una aplicación web orientada al entrenamiento físico, la selección de instructores y el seguimiento del progreso de los usuarios.

Este repositorio contiene el componente Frontend del proyecto, desarrollado con React y Vite.

El frontend permite al usuario interactuar con las diferentes funcionalidades de la aplicación y comunicarse con el backend mediante una API REST.

Tecnologías utilizadas
React
Vite
JavaScript
JSX
React Router DOM
Axios
HTML
CSS
Git
GitHub
Visual Studio Code
Arquitectura del Frontend

El frontend utiliza una estructura organizada por páginas y servicios.

El funcionamiento general es:

Usuario → React → Páginas → Servicios/Axios → API REST → Backend → Base de datos MySQL

Esta organización permite separar la interfaz de usuario de la comunicación con el backend.

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
│   │   ├── Pagos.jsx
│   │   ├── Calificaciones.jsx
│   │   ├── Seguimiento.jsx
│   │   ├── Historial.jsx
│   │   └── Mensajes.jsx
│   │
│   ├── services/
│   │   ├── instructorService.js
│   │   ├── disponibilidadService.js
│   │   ├── reservaService.js
│   │   ├── mensajeService.js
│   │   ├── historialService.js
│   │   ├── pagoService.js
│   │   └── ...
│   │
│   ├── App.jsx
│   └── ...
│
├── package.json
├── package-lock.json
└── README.md
Funcionalidades principales

El frontend permite:

Registrar usuarios.
Iniciar sesión.
Consultar y seleccionar rutinas.
Consultar y seleccionar instructores.
Consultar disponibilidad de los instructores.
Realizar reservas de entrenamiento.
Consultar las reservas realizadas.
Realizar el proceso de pago de una reserva.
Calificar al instructor después de completar una reserva.
Consultar el historial.
Registrar y consultar el seguimiento del progreso.
Enviar y consultar mensajes con los instructores.
Páginas principales
Inicio

Presenta la información general de MuscleMind y permite acceder a las principales funcionalidades de la aplicación.

Registro

Permite crear una nueva cuenta de usuario.

Inicio de sesión

Permite al usuario ingresar a la aplicación mediante sus credenciales.

Rutinas

Permite consultar las rutinas disponibles y seleccionar una rutina para continuar con el proceso de selección del instructor.

Instructores

Permite consultar los instructores disponibles y seleccionar un instructor relacionado con la rutina escogida.

Reserva

Permite seleccionar una fecha y un horario disponible para realizar el entrenamiento con el instructor seleccionado.

Mis Reservas

Permite consultar las reservas realizadas por el usuario y acceder a las opciones disponibles según el estado de cada reserva.

Pagos

Permite registrar el pago asociado a una reserva.

Calificaciones

Permite calificar al instructor después de completar una reserva y agregar un comentario.

Seguimiento

Permite registrar y consultar información relacionada con el progreso del usuario.

Historial

Permite consultar el historial de actividades realizadas.

Mensajes

Permite establecer comunicación entre el usuario y el instructor.

Rutas principales

El proyecto utiliza React Router DOM para controlar la navegación entre las diferentes páginas.

Ruta	Funcionalidad
/	Página de inicio
/login	Inicio de sesión
/register	Registro
/rutinas	Rutinas
/instructores	Instructores
/reserva	Reservas
/mis-reservas	Mis reservas
/pagos	Pagos
/calificaciones	Calificaciones
/seguimiento	Seguimiento
/historial	Historial
/mensajes/:idInstructor	Mensajes
Integración con el Backend

El frontend se comunica con el backend mediante solicitudes HTTP utilizando Axios.

El backend se encuentra disponible durante el desarrollo en:

http://localhost:3000

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

De esta manera, el frontend puede enviar y recibir información desde la API REST.

Flujo principal de la aplicación

El flujo principal implementado en MuscleMind es:

Registro / Inicio de sesión
          ↓
       Rutinas
          ↓
     Instructores
          ↓
       Reserva
          ↓
    Mis Reservas
       ↙      ↘
    Pago    Calificación
          ↓
       Historial

Adicionalmente, el usuario puede utilizar:

Seguimiento
Mensajes

para complementar su experiencia dentro de la aplicación.

Instalación

Para utilizar el frontend se debe clonar el repositorio:

git clone https://github.com/Sanlop22/Musclemind-1.3.git

Ingresar a la carpeta del frontend:

cd Musclemind-1.3/frontend

Instalar las dependencias:

npm install
Ejecución

Para iniciar el servidor de desarrollo:

npm run dev

Vite mostrará en la terminal la dirección local disponible para acceder a la aplicación.

Generalmente se encuentra disponible en:

http://localhost:5173
Ejecución completa del proyecto

Para utilizar MuscleMind correctamente se deben ejecutar los dos componentes del proyecto.

Backend

Desde la carpeta:

Musclemind-1.3/backend

ejecutar:

node index.js

El backend utiliza:

http://localhost:3000
Frontend

Desde otra terminal, ingresar a:

Musclemind-1.3/frontend

y ejecutar:

npm run dev

El frontend se conecta al backend mediante la API REST.

Pruebas

Durante el desarrollo se realizaron pruebas de las diferentes funcionalidades mediante:

Navegación entre páginas.
Registro de usuarios.
Inicio de sesión.
Consulta de rutinas.
Selección de instructores.
Consulta de disponibilidad.
Creación de reservas.
Consulta de mis reservas.
Registro de pagos.
Calificación de instructores.
Consulta del historial.
Registro y consulta de seguimiento.
Envío y consulta de mensajes.

También se verificó la comunicación entre:

Frontend → API REST → Backend → MySQL

Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Rama principal:

main

El proyecto cuenta con commits que registran los avances y modificaciones realizadas durante el desarrollo.

Estado actual del proyecto

El frontend se encuentra integrado con el backend y permite navegar por los principales módulos funcionales de MuscleMind.

Actualmente se encuentran integrados los módulos de:

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
Autores
Sandra López
Bárbara Jaramillo
Ronald Muñoz

Proyecto SENA

Proyecto desarrollado como parte del proceso formativo del programa Tecnólogo en Análisis y Desarrollo de Software – SENA.