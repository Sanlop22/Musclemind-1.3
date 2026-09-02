MuscleMind Frontend
## Repositorio 
https://github.com/Sanlop22/Musclemind-1.3/blob/main/src/app.js

Descripción

MuscleMind es una aplicación web orientada al entrenamiento físico, la creación de rutinas y el seguimiento del progreso de los usuarios.

Este repositorio contiene el componente frontend del proyecto, desarrollado utilizando React JS y Vite.

La interfaz permite al usuario navegar por las diferentes secciones de la aplicación, acceder al formulario de inicio de sesión y crear una cuenta mediante un formulario conectado con el backend.

Tecnologías utilizadas
React JS
Vite
JavaScript
JSX
React Router DOM
CSS
Fetch API
Node.js
Git
GitHub
Visual Studio Code
Estructura del proyecto
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── StatsBar.jsx
│   │   ├── Pilares.jsx
│   │   ├── Rutinas.jsx
│   │   ├── Progreso.jsx
│   │   ├── CtaFinal.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
└── README.md
Componentes principales

El frontend fue dividido en componentes reutilizables para organizar mejor la interfaz.

Navbar

Contiene la navegación principal de la aplicación.

Hero

Es la sección principal de la página de inicio. Presenta el propósito de MuscleMind y contiene botones para acceder al inicio de sesión y al registro.

StatsBar

Presenta información estadística relacionada con la propuesta de la aplicación.

Pilares

Muestra los principales pilares o características de MuscleMind.

Rutinas

Presenta información relacionada con las rutinas de entrenamiento.

Progreso

Representa la sección destinada al seguimiento del progreso del usuario.

CtaFinal

Contiene una llamada a la acción para incentivar al usuario a comenzar a utilizar la aplicación.

Footer

Contiene la información final de la página.

Páginas
Inicio

Ruta:

/

La página de inicio presenta la propuesta principal de MuscleMind y sus diferentes secciones informativas.

Inicio de sesión

Ruta:

/login

Permite visualizar el formulario para que el usuario pueda ingresar sus credenciales.

Actualmente se encuentra implementada la interfaz de inicio de sesión y su navegación dentro de la aplicación.

Registro

Ruta:

/register

Contiene el formulario para crear una nueva cuenta de usuario.

El formulario solicita información como:

Nombre
Apellido
Tipo de documento
Número de documento
Contraseña
Edad
Peso
Altura
País
Navegación

Para controlar la navegación entre las páginas se utiliza React Router DOM.

Las rutas principales son:

/
├── /login
└── /register

Los botones de la página principal permiten navegar directamente a las páginas correspondientes.

También se incorporaron botones para regresar a la página de inicio.

Registro de usuarios

El formulario de registro se encuentra conectado con el backend de MuscleMind.

Al enviar el formulario, React recopila la información ingresada y realiza una solicitud POST hacia:

http://localhost:3000/api/usuarios

Los datos son enviados en formato JSON.

Ejemplo:

{
  "nombre": "Sandra",
  "apellido": "Prueba",
  "numero_documento": "99999999",
  "tipo_documento": "CC",
  "contrasena": "123456",
  "edad": 30,
  "peso": 70,
  "altura": 165,
  "pais": "Colombia"
}

Cuando el registro es exitoso, el frontend muestra un mensaje de confirmación al usuario y limpia nuevamente el formulario.

Comunicación Frontend - Backend

La comunicación entre los componentes se realiza mediante solicitudes HTTP.

El flujo del registro es:

Usuario
   ↓
Formulario Register.jsx
   ↓
React
   ↓
Fetch API
   ↓
Backend Express
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL

Después de realizar el registro, la respuesta del backend es procesada por el frontend para informar al usuario si la operación fue exitosa o si ocurrió algún error.

Manejo de estado

El formulario de registro utiliza useState de React para almacenar y actualizar los valores ingresados por el usuario.

Cada campo del formulario está relacionado con un estado que permite controlar la información introducida.

También se utilizan eventos como onChange y onSubmit para controlar la interacción con el formulario.

Diseño y estilos

Los estilos de la aplicación fueron desarrollados utilizando CSS.

Los principales archivos de estilos son:

src/App.css
src/index.css

Se diseñaron estilos para:

Barra de navegación
Página principal
Hero
Botones
Formularios
Página de inicio de sesión
Página de registro
Secciones informativas
Pie de página
Instalación

Clonar el repositorio:

git clone https://github.com/Sanlop22/Musclemind-1.3.git

Ingresar a la carpeta del frontend:

cd Musclemind-1.3/frontend

Instalar las dependencias:

npm install
Ejecución

Para iniciar el servidor de desarrollo:

npm run dev

Vite proporciona una dirección local similar a:

http://localhost:5173/
Integración con el Backend

Para utilizar correctamente el registro de usuarios se debe tener el backend ejecutándose en:

http://localhost:3000

y el frontend ejecutándose mediante Vite.

De esta manera, el formulario de registro puede enviar la información desde React hacia la API del backend.

Control de versiones

El proyecto utiliza Git y GitHub para registrar los cambios realizados durante el desarrollo.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Entre los cambios realizados se encuentran:

Implementación del frontend con React.
Creación de componentes reutilizables.
Implementación de las páginas de inicio, login y registro.
Configuración de React Router.
Integración del formulario de registro con la API.
Organización de estilos CSS.
Corrección y reorganización de componentes.
Integración entre frontend, backend y base de datos.
Estado actual del proyecto

El frontend de MuscleMind cuenta con una interfaz funcional desarrollada en React JS, navegación entre las principales páginas y un formulario de registro conectado con el backend.

La integración permite registrar usuarios desde la interfaz web y almacenar la información en la base de datos MySQL mediante la API REST.

Autores
Sandra Lopez
Barbara Jaramillo
Ronald Muñoz
David Lizcano
