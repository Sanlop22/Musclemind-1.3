-- Ajusta rutina y seguimiento al diseño original del código (ejecutar una sola vez por base de datos)

ALTER TABLE rutina
  CHANGE COLUMN dificultad nivel VARCHAR(45) NOT NULL,
  CHANGE COLUMN duracion duracion_minutos INT NOT NULL;

ALTER TABLE rutina
  ADD COLUMN id_usuario INT NULL AFTER id_rutina,
  ADD COLUMN descripcion VARCHAR(255) NULL AFTER nombre_rutina,
  ADD COLUMN objetivo VARCHAR(100) NULL AFTER descripcion,
  ADD COLUMN dias_por_semana INT NULL AFTER nivel,
  ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'activa',
  ADD COLUMN fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE rutina
  ADD CONSTRAINT fk_rutina_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);

ALTER TABLE seguimiento
  CHANGE COLUMN peso_levantado peso DECIMAL(5,2) NULL,
  CHANGE COLUMN series series_completadas INT NULL,
  CHANGE COLUMN repeticiones repeticiones_completadas INT NULL,
  CHANGE COLUMN observaciones comentarios VARCHAR(255) NULL;

ALTER TABLE seguimiento
  ADD COLUMN porcentaje_grasa DECIMAL(5,2) NULL AFTER peso,
  ADD COLUMN masa_muscular DECIMAL(5,2) NULL AFTER porcentaje_grasa,
  ADD COLUMN nivel_esfuerzo INT NULL AFTER repeticiones_completadas;