-- =====================================================================
-- Migración para una base "musclemind" creada con la versión anterior
-- (usuario sin correo/contrasena/rol e instructor con su propio correo
-- y password). Ejecutar UNA sola vez, completo, en MySQL Workbench.
--
-- Los usuarios que ya existían no tenían correo ni contraseña, así que
-- reciben un correo provisional (usuarioN@sin-correo.local) y no podrán
-- iniciar sesión; para probar, registra cuentas nuevas desde la app.
-- Los instructores antiguos quedan sin cuenta ligada (id_usuario NULL).
-- =====================================================================

USE musclemind;

-- usuario: agrega correo, contrasena y rol; permite campos opcionales
-- (un instructor se registra sin edad, peso ni altura)
ALTER TABLE usuario
  MODIFY edad           INT NULL,
  MODIFY tipo_documento VARCHAR(45) NULL,
  MODIFY peso           DECIMAL(5,2) NULL,
  MODIFY altura         DECIMAL(5,2) NULL,
  MODIFY pais           VARCHAR(45) NULL,
  ADD COLUMN correo     VARCHAR(100) NULL,
  ADD COLUMN contrasena VARCHAR(255) NULL,
  ADD COLUMN rol        VARCHAR(20) NOT NULL DEFAULT 'usuario';

-- MySQL Workbench trae activado el "safe update mode"; se desactiva solo aquí
SET SQL_SAFE_UPDATES = 0;

UPDATE usuario
   SET correo = CONCAT('usuario', id_usuario, '@sin-correo.local'),
       contrasena = ''
 WHERE correo IS NULL;

SET SQL_SAFE_UPDATES = 1;

ALTER TABLE usuario
  MODIFY correo     VARCHAR(100) NOT NULL,
  MODIFY contrasena VARCHAR(255) NOT NULL,
  ADD UNIQUE KEY uq_usuario_correo (correo);

-- instructor: ahora se liga a una cuenta de usuario y ya no guarda
-- correo ni contraseña propios
ALTER TABLE instructor
  DROP INDEX correo,
  DROP COLUMN correo,
  DROP COLUMN password_hash,
  ADD COLUMN id_usuario INT NULL,
  ADD UNIQUE KEY uq_instructor_usuario (id_usuario),
  ADD CONSTRAINT fk_instructor_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE;
