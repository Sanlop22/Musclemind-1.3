## Repositorio 
https://github.com/Sanlop22/Musclemind-1.3/blob/main/src/app.js

MuscleMind Backend

Backend del proyecto MuscleMind, una aplicación orientada a la promoción de hábitos saludables mediante la planificación y seguimiento de rutinas de entrenamiento personalizadas.

Descripción

MuscleMind permite gestionar información relacionada con los usuarios de la aplicación y proporciona servicios para el registro e inicio de sesión.

El backend proporciona una API REST desarrollada con Node.js y Express, conectada a una base de datos MySQL.

La aplicación implementa una arquitectura modular que permite separar las responsabilidades de las diferentes partes del sistema.

Tecnologías utilizadas
Node.js
Express.js
MySQL
MySQL2
Dotenv
Bcrypt
Git
GitHub
Visual Studio Code
Postman
Arquitectura del proyecto

El proyecto utiliza una arquitectura modular para separar las responsabilidades del sistema.

musclemind-backend/
│
├── src/
│   ├── database/
│   │   └── connection.js
│   │
│   └── modules/
│       └── users/
│           ├── user.controller.js
│           ├── user.repository.js
│           ├── user.service.js
│           ├── user.routes.js
│           └── user.validator.js
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

El módulo permite realizar operaciones CRUD sobre los usuarios almacenados en la base de datos y cuenta además con un servicio de autenticación para el inicio de sesión.

Funcionalidades implementadas
Consultar todos los usuarios.
Consultar un usuario por su ID.
Registrar nuevos usuarios.
Actualizar información de usuarios.
Eliminar usuarios.
Iniciar sesión mediante número de documento y contraseña.
Validar información recibida.
Conectar el sistema con MySQL.
Manejar errores básicos de la API.
Encriptar las contraseñas mediante Bcrypt.
API REST

La API se ejecuta localmente mediante:

http://localhost:3000
Endpoints de usuarios
Método	Endpoint	Descripción
GET	/api/usuarios	Consultar todos los usuarios
GET	/api/usuarios/:id	Consultar un usuario por ID
POST	/api/usuarios	Registrar un nuevo usuario
POST	/api/usuarios/login	Iniciar sesión
PUT	/api/usuarios/:id	Actualizar un usuario
DELETE	/api/usuarios/:id	Eliminar un usuario
Registro de usuario
Endpoint
POST /api/usuarios
Ejemplo de solicitud
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
Respuesta

La API devuelve una respuesta de creación exitosa con código HTTP 201 Created.

Inicio de sesión
Endpoint
POST /api/usuarios/login
Ejemplo de solicitud
{
  "numero_documento": "88888888",
  "contrasena": "123456"
}
Respuesta exitosa

Código HTTP:

200 OK

Ejemplo:

{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Sandra",
    "apellido": "Prueba",
    "correo": "sandra.prueba888@gmail.com"
  }
}
Credenciales incorrectas

Cuando el número de documento o la contraseña no son correctos, la API responde con:

401 Unauthorized

Ejemplo:

{
  "error": "Credenciales incorrectas"
}
Campos obligatorios

Si no se envía el número de documento o la contraseña, la API responde con:

400 Bad Request

Ejemplo:

{
  "error": "El número de documento y la contraseña son obligatorios"
}
Consultar usuarios
Endpoint
GET /api/usuarios

Permite obtener la información de los usuarios registrados en la base de datos.

Consultar usuario por ID
Endpoint
GET /api/usuarios/:id

Ejemplo:

GET /api/usuarios/1

Permite consultar un usuario específico mediante su identificador.

Actualizar usuario
Endpoint
PUT /api/usuarios/:id

Ejemplo:

PUT /api/usuarios/1

Permite actualizar la información de un usuario existente.

Eliminar usuario
Endpoint
DELETE /api/usuarios/:id

Ejemplo:

DELETE /api/usuarios/1

Permite eliminar un usuario existente de la base de datos.

Validaciones

El módulo de usuarios cuenta con validaciones para controlar la información recibida por la API.

Entre las validaciones implementadas se encuentran:

Nombre obligatorio.
Nombre con mínimo de caracteres.
Apellido obligatorio.
Número de documento obligatorio.
Validación de edad.
Validación del tipo de documento.
Validación del peso.
Validación de la altura.
Validación básica del país.
Validación de los campos necesarios para el inicio de sesión.
Seguridad de contraseñas

Las contraseñas de los usuarios no se almacenan directamente en texto plano.

Antes de guardar una contraseña en la base de datos, el servicio utiliza Bcrypt para generar un hash de la contraseña.

Durante el inicio de sesión se compara la contraseña ingresada con el hash almacenado en la base de datos.

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
git clone https://github.com/Sanlop22/Musclemind-1.3.git
2. Entrar a la carpeta del proyecto
cd Musclemind-1.3
3. Instalar las dependencias
npm install
4. Configurar las variables de entorno

Crear un archivo .env en la raíz del proyecto y configurar los datos de conexión a MySQL.

5. Ejecutar el servidor
node index.js

El servidor se ejecutará en:

http://localhost:3000
Pruebas de la API

Las pruebas funcionales de los endpoints se realizaron utilizando Postman.

Se verificaron diferentes operaciones, entre ellas:

Registro de usuarios.
Consulta de usuarios.
Consulta de usuario por ID.
Actualización de usuarios.
Eliminación de usuarios.
Inicio de sesión exitoso.
Inicio de sesión con credenciales incorrectas.
Validación de campos obligatorios.
Control de versiones

El proyecto utiliza Git para el control de versiones y GitHub como repositorio remoto.

Los cambios realizados durante el desarrollo se registran mediante commits para mantener un historial del proyecto.

Repositorio:

https://github.com/Sanlop22/Musclemind-1.3

Estado del proyecto

Actualmente se encuentra implementado el backend inicial de MuscleMind, incluyendo:

API REST.
Módulo de usuarios.
Operaciones CRUD.
Registro de usuarios.
Inicio de sesión.
Validaciones.
Conexión con MySQL.
Manejo básico de errores.
Encriptación de contraseñas.
Pruebas mediante Postman.

El proyecto continuará con el desarrollo e integración de los demás módulos requeridos para MuscleMind.

Autores
Sandra Lopez
Barbara Jaramillo
Ronald Muñoz
David Lizcano