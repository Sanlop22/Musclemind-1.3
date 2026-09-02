## Repositorio 
https://github.com/Sanlop22/Musclemind-1.3/blob/main/src/app.js

MuscleMind Backend
Descripción

MuscleMind es una aplicación web orientada al entrenamiento físico y al seguimiento del progreso de los usuarios.

Este repositorio contiene el componente backend del proyecto, desarrollado con Node.js y Express.js. El backend proporciona una API REST encargada de gestionar la información de los usuarios y establecer la comunicación con la base de datos MySQL.

Tecnologías utilizadas
Node.js
Express.js
MySQL
MySQL2
Dotenv
CORS
Git
GitHub
Visual Studio Code
Arquitectura del proyecto

El backend utiliza una arquitectura organizada por responsabilidades para facilitar el mantenimiento y la escalabilidad del código.

backend/
│
├── database/
│   └── connection.js
│
├── src/
│   ├── modules/
│   │   └── users/
│   │       ├── user.controller.js
│   │       ├── user.repository.js
│   │       ├── user.routes.js
│   │       ├── user.service.js
│   │       └── user.validator.js
│   │
│   └── app.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
Funciones principales

El módulo de usuarios permite:

Consultar los usuarios registrados.
Consultar usuarios mediante la API.
Registrar nuevos usuarios.
Actualizar información de usuarios.
Eliminar usuarios.
Validar los datos recibidos desde las solicitudes.
Conectar el backend con la base de datos MySQL.
Organización de las capas
Routes

Las rutas reciben las solicitudes HTTP y las dirigen al controlador correspondiente.

Ejemplo:

/api/usuarios
Controller

El controlador recibe las solicitudes y las respuestas HTTP. Se encarga de comunicarse con la capa de servicios.

Service

La capa de servicios contiene la lógica de negocio de las operaciones realizadas sobre los usuarios.

Repository

El repositorio se encarga de realizar las operaciones directamente sobre la base de datos MySQL.

Validator

El validador comprueba que los datos enviados cumplan con las condiciones requeridas antes de realizar las operaciones correspondientes.

Base de datos

El proyecto utiliza MySQL como sistema gestor de base de datos.

La base de datos utilizada es:

musclemind

Una de las tablas principales es:

usuario

La información gestionada por el registro de usuarios incluye datos como:

Nombre
Apellido
Tipo de documento
Número de documento
Contraseña
Edad
Peso
Altura
País
Variables de entorno

La conexión a MySQL se configura mediante variables de entorno almacenadas en el archivo .env.

Ejemplo:

DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=musclemind
DB_CONNECTION_LIMIT=10

El archivo .env no debe publicarse en GitHub cuando contiene información real de acceso a la base de datos.

API REST

El backend funciona mediante una API REST.

Obtener usuarios
GET http://localhost:3000/api/usuarios

Permite consultar los usuarios almacenados en la base de datos.

Registrar usuario
POST http://localhost:3000/api/usuarios

Permite registrar un nuevo usuario mediante el envío de los datos correspondientes.

Actualizar usuario
PUT http://localhost:3000/api/usuarios/:id

Permite modificar la información de un usuario existente.

Eliminar usuario
DELETE http://localhost:3000/api/usuarios/:id

Permite eliminar un usuario mediante su identificador.

Ejemplo de registro

El endpoint POST recibe información como:

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
Instalación

Clonar el repositorio:

git clone https://github.com/Sanlop22/Musclemind-1.3.git

Ingresar a la carpeta del backend:

cd Musclemind-1.3/backend

Instalar las dependencias:

npm install

Configurar las variables de entorno en el archivo .env.

Ejecución

Para iniciar el servidor:

node index.js

El servidor se ejecuta en:

http://localhost:3000
Pruebas

Las rutas de la API fueron probadas mediante solicitudes HTTP utilizando herramientas de prueba de API y verificando posteriormente la información almacenada en MySQL.

Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Se han realizado commits para registrar los avances y modificaciones realizadas durante el desarrollo del proyecto.

Autores
Sandra Lopez
Barbara Jaramillo
Ronald Muñoz
David Lizcano
Estado del proyecto

El backend cuenta con el módulo de usuarios desarrollado y conectado con una base de datos MySQL, permitiendo realizar operaciones CRUD y validar la información recibida mediante la API REST.