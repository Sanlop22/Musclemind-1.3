## Repositorio 
https://github.com/Sanlop22/Musclemind-1.3/blob/main/src/app.js

## MuscleMind Backend

Backend del proyecto MuscleMind, una aplicación orientada a la promoción de hábitos saludables mediante la planificación y seguimiento de rutinas de entrenamiento personalizadas.

Descripción

MuscleMind permite gestionar información relacionada con usuarios y, posteriormente, otros módulos necesarios para el funcionamiento de la aplicación.

El backend proporciona una API REST desarrollada con Node.js y Express, conectada a una base de datos MySQL.

Tecnologías utilizadas
Node.js
Express.js
MySQL
MySQL2
Dotenv
Git
GitHub
Visual Studio Code
Arquitectura del proyecto

El proyecto utiliza una arquitectura modular para separar las responsabilidades del sistema.

musclemind-backend/
│
├── database/
│   └── connection.js
│
├── modules/
│   └── users/
│       ├── user.controller.js
│       ├── user.repository.js
│       ├── user.service.js
│       ├── user.routes.js
│       └── user.validator.js
│
├── .env
├── .gitignore
├── app.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
Módulo de usuarios

Actualmente se encuentra implementado el módulo de usuarios.

El módulo permite realizar operaciones relacionadas con los usuarios almacenados en la base de datos.

Funcionalidades actuales
Consultar usuarios.
Crear usuarios.
Conectar el módulo con la base de datos MySQL.
Organizar la lógica mediante controlador, servicio y repositorio.
Validar la información recibida mediante el módulo correspondiente.
API

La API utiliza rutas REST.

Usuarios

Consultar usuarios

GET /api/usuarios

Crear usuario

POST /api/usuarios

Las rutas pueden ampliarse posteriormente para implementar las operaciones de actualización y eliminación de usuarios.

Base de datos

El proyecto utiliza MySQL como sistema de gestión de base de datos.

La conexión se realiza mediante un pool de conexiones utilizando el paquete mysql2.

Las variables de configuración de la base de datos se almacenan en un archivo .env para evitar colocar información sensible directamente en el código fuente.

Ejemplo:

DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=musclemind

El archivo .env no debe subirse al repositorio de GitHub.

Instalación

Para ejecutar el proyecto localmente:

1. Clonar el repositorio
git clone https://github.com/Sanlop22/Musclemind-1.3/blob/main/src/app.js
2. Entrar a la carpeta
cd musclemind-backend
3. Instalar las dependencias
npm install
4. Configurar las variables de entorno

Crear un archivo .env en la raíz del proyecto y configurar los datos de conexión a MySQL.

5. Ejecutar el servidor
node index.js
Prueba de la API

Una vez iniciado el servidor, se puede probar el endpoint de usuarios utilizando un navegador, Postman u otra herramienta para consumir APIs.

http://localhost:3000/api/usuarios
Control de versiones

El proyecto utiliza Git para el control de versiones y GitHub como repositorio remoto.

Los cambios se registran mediante commits para mantener un historial del desarrollo.

Estado del proyecto

Actualmente se encuentra implementada la estructura inicial del backend y el módulo de usuarios con conexión a MySQL.

Se continuará con el desarrollo de los demás módulos requeridos para el proyecto MuscleMind.

Autores
Sandra Lopez
Barbara Jaramillo
Ronald Muñoz
David Lizcano