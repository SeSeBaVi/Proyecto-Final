-- Crear base de datos si no existe y usarla
CREATE DATABASE IF NOT EXISTS eventos_culturales_cusco DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventos_culturales_cusco;

-- Eliminar tablas si ya existen (en orden inverso a las dependencias)
DROP TABLE IF EXISTS evento_categoria;
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

-- Tabla: usuarios
CREATE TABLE usuarios (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  tipo ENUM('cliente', 'admin') NOT NULL,
  estado TINYINT(1) DEFAULT 1,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: categorias
CREATE TABLE categorias (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: eventos
CREATE TABLE eventos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  fecha_evento DATE NOT NULL,
  hora_evento TIME DEFAULT NULL,
  lugar VARCHAR(150) DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  id_creador INT(11) DEFAULT NULL,
  estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'aprobado',
  fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY id_creador (id_creador),
  CONSTRAINT eventos_ibfk_1 FOREIGN KEY (id_creador) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: comentarios
CREATE TABLE comentarios (
  id INT(11) NOT NULL AUTO_INCREMENT,
  id_evento INT(11) DEFAULT NULL,
  id_usuario INT(11) DEFAULT NULL,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY id_evento (id_evento),
  KEY id_usuario (id_usuario),
  CONSTRAINT comentarios_ibfk_1 FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE,
  CONSTRAINT comentarios_ibfk_2 FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: evento_categoria
CREATE TABLE evento_categoria (
  id_evento INT(11) NOT NULL,
  id_categoria INT(11) NOT NULL,
  PRIMARY KEY (id_evento, id_categoria),
  KEY id_categoria (id_categoria),
  CONSTRAINT evento_categoria_ibfk_1 FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE,
  CONSTRAINT evento_categoria_ibfk_2 FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserción de Datos

-- Insertar usuarios
INSERT INTO usuarios (nombre, email, password, tipo) VALUES
('Juan Pérez', 'juan@example.com', '$2y$10$k1v8w6p6u7QJQw7J1kQw8uQw8K2kQw8K2kQw8K2kQw8K2kQw8K2k', 'cliente'),
('María Gómez', 'maria@example.com', '$2y$10$z8n5w4m4t5QHQw6H2kQw8uQw8K2kQw8K2kQw8K2kQw8K2kQw8K2k', 'cliente'),
('Admin General', 'admin@example.com', '$2y$10$w1r9w7p7v8QKQw8K2kQw8uQw8K2kQw8K2kQw8K2kQw8K2kQw8K2k', 'admin');
select * from usuarios;

-- Insertar categorías
INSERT INTO categorias (nombre) VALUES
('Música'),
('Teatro'),
('Danza'),
('Exposición de arte');

-- Insertar eventos
INSERT INTO eventos (titulo, descripcion, fecha_evento, hora_evento, lugar, imagen, id_creador, estado) VALUES
('Concierto de Rock Andino', 'Un concierto con bandas locales de rock andino.', '2025-06-15', '19:00:00', 'Teatro Municipal del Cusco', 'rock_andino.jpg', 2, 'aprobado'),
('Obra de teatro "Los Incas"', 'Representación teatral de la historia incaica.', '2025-06-20', '18:30:00', 'Centro Cultural de Cusco', 'obra_incas.jpg', 2, 'aprobado');
select * from eventos;

-- Insertar relación evento-categoría
INSERT INTO evento_categoria (id_evento, id_categoria) VALUES
(1, 1), -- Concierto de Rock Andino -> Música
(2, 2), -- Obra de teatro "Los Incas" -> Teatro
(2, 4); -- Obra de teatro "Los Incas" -> Exposición de arte

-- Insertar comentarios
INSERT INTO comentarios (id_evento, id_usuario, contenido) VALUES
(1, 1, '¡Qué buena propuesta cultural! Espero asistir.'),
(2, 1, 'Me encanta el teatro, ¡estaré ahí!'),
(1, 3, 'Evento aprobado por la administración.');
