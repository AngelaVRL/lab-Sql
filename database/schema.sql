DROP DATABASE IF EXISTS videojuegos;
CREATE DATABASE videojuegos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE videojuegos;

CREATE TABLE publisher (
  publisher_id INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  CONSTRAINT uq_publisher_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE platform (
  platform_id INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(10) NOT NULL,
  CONSTRAINT uq_platform_code UNIQUE (code)
) ENGINE=InnoDB;

CREATE TABLE genre (
  genre_id INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(30) NOT NULL,
  CONSTRAINT uq_genre_name UNIQUE (name)
) ENGINE=InnoDB;

-- Llave sustituta: (name, platform, year) se repite en el dataset
CREATE TABLE game_release (
  release_id   INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  release_year SMALLINT NULL,
  platform_id  INT NOT NULL,
  genre_id     INT NOT NULL,
  publisher_id INT NULL,
  na_sales     DECIMAL(6,2) NOT NULL,
  eu_sales     DECIMAL(6,2) NOT NULL,
  jp_sales     DECIMAL(6,2) NOT NULL,
  other_sales  DECIMAL(6,2) NOT NULL,
  CONSTRAINT fk_release_platform  FOREIGN KEY (platform_id)  REFERENCES platform(platform_id),
  CONSTRAINT fk_release_genre     FOREIGN KEY (genre_id)     REFERENCES genre(genre_id),
  CONSTRAINT fk_release_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id),
  CONSTRAINT ck_sales_non_negative CHECK (
    na_sales >= 0 AND eu_sales >= 0 AND jp_sales >= 0 AND other_sales >= 0),
  CONSTRAINT ck_release_year_range CHECK (
    release_year IS NULL OR release_year BETWEEN 1950 AND 2030)
) ENGINE=InnoDB;

CREATE INDEX idx_release_publisher  ON game_release (publisher_id);
CREATE INDEX idx_release_genre_year ON game_release (genre_id, release_year);

-- Global_Sales no se almacena: es la suma de las cuatro regiones
CREATE VIEW v_game_sales AS
SELECT release_id, name, release_year, platform_id, genre_id, publisher_id,
       na_sales, eu_sales, jp_sales, other_sales,
       (na_sales + eu_sales + jp_sales + other_sales) AS global_sales
FROM game_release;