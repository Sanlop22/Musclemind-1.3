-- =====================================================================
-- Migración: módulos Rutinas y Seguimiento
-- Requiere que la tabla `usuario` ya exista en la base de datos musclemind
-- Ejecutar en MySQL Workbench o por consola:
--   mysql -u root -p musclemind < 002_rutina_seguimiento.sql
-- =====================================================================

USE musclemind;

-- ---------------------------------------------------------------------
-- Tabla: rutina
-- Un usuario puede tener varias rutinas de entrenamiento.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rutina (
    id_rutina        INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario       INT NOT NULL,
    nombre_rutina    VARCHAR(100) NOT NULL,
    descripcion      TEXT,
    objetivo         VARCHAR(50),
    nivel            VARCHAR(20) NOT NULL,
    dias_por_semana  INT,
    duracion_minutos INT,
    estado           VARCHAR(10) NOT NULL DEFAULT 'activa',
    fecha_creacion   DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rutina_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: seguimiento
-- Registro de progreso de un usuario. id_rutina es opcional porque un
-- registro de seguimiento (ej. pesaje) puede no estar ligado a una
-- sesión de entrenamiento específica.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seguimiento (
    id_seguimiento           INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario               INT NOT NULL,
    id_rutina                INT NULL,
    fecha                    DATE NOT NULL,
    peso                     DECIMAL(5,2),
    porcentaje_grasa         DECIMAL(5,2),
    masa_muscular            DECIMAL(5,2),
    series_completadas       INT,
    repeticiones_completadas INT,
    nivel_esfuerzo           INT,
    comentarios              TEXT,

    CONSTRAINT fk_seguimiento_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_seguimiento_rutina
        FOREIGN KEY (id_rutina) REFERENCES rutina(id_rutina)
        ON DELETE SET NULL
) ENGINE=InnoDB;
