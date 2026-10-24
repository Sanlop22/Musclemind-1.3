-- =====================================================================
-- MuscleMind - Estructura de la base de datos (MySQL 8)
-- Crea la base de datos "musclemind" y todas sus tablas, sin datos.
-- Es el esquema que necesita el código actual del backend
-- (usuario con correo/contrasena/rol e instructor ligado a usuario).
--
-- Uso: abrir en MySQL Workbench y ejecutar todo el archivo (rayo).
-- Es seguro ejecutarlo más de una vez: no borra tablas existentes.
--
-- Si ya tenías una base "musclemind" creada con una versión anterior,
-- usa en su lugar backend/sql/migracion_usuario_instructor.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS musclemind
  DEFAULT CHARACTER SET utf8mb4;

USE musclemind;

-- ---------------------------------------------------------------------
-- usuario: cuentas de la aplicación (rol: usuario | instructor | admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario       INT NOT NULL AUTO_INCREMENT,
  nombre           VARCHAR(45)  NOT NULL,
  apellido         VARCHAR(45)  NOT NULL,
  edad             INT NULL,
  tipo_documento   VARCHAR(45)  NULL,
  numero_documento VARCHAR(20)  NOT NULL,
  peso             DECIMAL(5,2) NULL,
  altura           DECIMAL(5,2) NULL,
  pais             VARCHAR(45)  NULL,
  correo           VARCHAR(100) NOT NULL,
  contrasena       VARCHAR(255) NOT NULL,          -- hash bcrypt
  rol              VARCHAR(20)  NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id_usuario),
  UNIQUE KEY numero_documento_UNIQUE (numero_documento),
  UNIQUE KEY uq_usuario_correo (correo)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- instructor: perfil de instructor, ligado a su cuenta de usuario
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instructor (
  id_instructor INT NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(45) NOT NULL,
  apellido      VARCHAR(45) NOT NULL,
  experiencia   INT NOT NULL,
  especialidad  VARCHAR(45) NOT NULL,
  id_usuario    INT NULL,
  PRIMARY KEY (id_instructor),
  UNIQUE KEY uq_instructor_usuario (id_usuario),
  CONSTRAINT fk_instructor_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- rutina: rutinas de un usuario (id_usuario nulo = rutina general)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rutina (
  id_rutina        INT NOT NULL AUTO_INCREMENT,
  id_usuario       INT NULL,
  nombre_rutina    VARCHAR(45)  NOT NULL,
  descripcion      VARCHAR(255) NULL,
  objetivo         VARCHAR(100) NULL,
  nivel            VARCHAR(45)  NOT NULL,
  dias_por_semana  INT NULL,
  duracion_minutos INT NOT NULL,
  estado           VARCHAR(20)  NOT NULL DEFAULT 'activa',
  fecha_creacion   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_rutina),
  KEY fk_rutina_usuario (id_usuario),
  CONSTRAINT fk_rutina_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- disponibilidad: bloques horarios de cada instructor
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disponibilidad (
  id_disponibilidad INT NOT NULL AUTO_INCREMENT,
  id_instructor     INT NOT NULL,
  dia_semana  ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin    TIME NOT NULL,
  estado      ENUM('disponible','ocupado') NOT NULL DEFAULT 'disponible',
  PRIMARY KEY (id_disponibilidad),
  KEY fk_disponibilidad_instructor_idx (id_instructor),
  CONSTRAINT fk_disponibilidad_instructor FOREIGN KEY (id_instructor)
    REFERENCES instructor (id_instructor) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- reserva: sesiones reservadas por un usuario con un instructor
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reserva (
  id_reserva    INT NOT NULL AUTO_INCREMENT,
  id_usuario    INT NOT NULL,
  id_instructor INT NOT NULL,
  id_rutina     INT NOT NULL,
  objetivo      VARCHAR(255) NULL,
  fecha         DATE NOT NULL,
  hora_inicio   TIME NOT NULL,
  hora_fin      TIME NOT NULL,
  estado ENUM('pendiente','confirmada','en_curso','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  precio        DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (id_reserva),
  KEY fk_reserva_usuario_idx (id_usuario),
  KEY fk_reserva_instructor_idx (id_instructor),
  KEY fk_reserva_rutina_idx (id_rutina),
  CONSTRAINT fk_reserva_instructor FOREIGN KEY (id_instructor)
    REFERENCES instructor (id_instructor) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_reserva_rutina FOREIGN KEY (id_rutina)
    REFERENCES rutina (id_rutina) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- pago: un pago por reserva
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pago (
  id_pago            INT NOT NULL AUTO_INCREMENT,
  id_reserva         INT NOT NULL,
  monto              DECIMAL(8,2) NOT NULL,
  metodo_pago        ENUM('efectivo','tarjeta','transferencia','otro') NOT NULL DEFAULT 'otro',
  estado             ENUM('pendiente','pagado','reembolsado','fallido') NOT NULL DEFAULT 'pendiente',
  referencia_externa VARCHAR(100) NULL,
  fecha_pago         DATETIME NULL,
  PRIMARY KEY (id_pago),
  UNIQUE KEY uq_pago_reserva (id_reserva),
  CONSTRAINT fk_pago_reserva FOREIGN KEY (id_reserva)
    REFERENCES reserva (id_reserva) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- calificacion: una fila por reserva, con la nota de cada parte
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calificacion (
  id_calificacion                 INT NOT NULL AUTO_INCREMENT,
  id_reserva                      INT NOT NULL,
  puntuacion_usuario_a_instructor TINYINT NULL,
  comentario_usuario_a_instructor VARCHAR(255) NULL,
  puntuacion_instructor_a_usuario TINYINT NULL,
  comentario_instructor_a_usuario VARCHAR(255) NULL,
  fecha                           DATETIME NOT NULL,
  PRIMARY KEY (id_calificacion),
  UNIQUE KEY uq_calificacion_reserva (id_reserva),
  CONSTRAINT fk_calificacion_reserva FOREIGN KEY (id_reserva)
    REFERENCES reserva (id_reserva) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- mensaje: chat entre un usuario y un instructor
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensaje (
  id_mensaje    INT NOT NULL AUTO_INCREMENT,
  id_usuario    INT NOT NULL,
  id_instructor INT NOT NULL,
  remitente     ENUM('usuario','instructor') NOT NULL,
  contenido     VARCHAR(500) NOT NULL,
  fecha         DATETIME NOT NULL,
  PRIMARY KEY (id_mensaje),
  KEY fk_mensaje_usuario_idx (id_usuario),
  KEY fk_mensaje_instructor_idx (id_instructor),
  CONSTRAINT fk_mensaje_instructor FOREIGN KEY (id_instructor)
    REFERENCES instructor (id_instructor) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_mensaje_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- historial: registros de progreso de un usuario
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historial (
  id_historial      INT NOT NULL AUTO_INCREMENT,
  id_usuario        INT NOT NULL,
  fecha             DATE NOT NULL,
  registro_progreso VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_historial),
  KEY fk_historial_usuario_idx (id_usuario),
  CONSTRAINT fk_historial_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- seguimiento: medidas y avance de un usuario en una rutina
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seguimiento (
  id_seguimiento           INT NOT NULL AUTO_INCREMENT,
  id_usuario               INT NOT NULL,
  id_rutina                INT NOT NULL,
  fecha                    DATE NOT NULL,
  peso                     DECIMAL(5,2) NULL,
  porcentaje_grasa         DECIMAL(5,2) NULL,
  masa_muscular            DECIMAL(5,2) NULL,
  repeticiones_completadas INT NULL,
  nivel_esfuerzo           INT NULL,
  series_completadas       INT NULL,
  comentarios              VARCHAR(255) NULL,
  PRIMARY KEY (id_seguimiento),
  KEY fk_seguimiento_usuario_idx (id_usuario),
  KEY fk_seguimiento_rutina_idx (id_rutina),
  CONSTRAINT fk_seguimiento_rutina FOREIGN KEY (id_rutina)
    REFERENCES rutina (id_rutina) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_seguimiento_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
