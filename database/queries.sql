USE videojuegos;

-- 1: éxitos recientes.

SELECT name, release_year, global_sales
FROM v_game_sales
WHERE release_year >= 2010 AND global_sales > 5
ORDER BY global_sales DESC;

-- 2: juegos de Nintendo con más ventas en Norteamérica.
SELECT g.name, g.release_year, p.name AS publisher
FROM game_release g
JOIN publisher p ON p.publisher_id = g.publisher_id
WHERE p.name = 'Nintendo'
ORDER BY g.na_sales DESC
LIMIT 10;

-- 3: ficha completa de los 10 juegos más vendidos.
SELECT v.name, pl.code AS platform, ge.name AS genre, p.name AS publisher,
       ROUND(v.global_sales, 2) AS global_sales
FROM v_game_sales v
JOIN platform pl ON pl.platform_id = v.platform_id
JOIN genre ge ON ge.genre_id = v.genre_id
JOIN publisher p ON p.publisher_id = v.publisher_id
ORDER BY v.global_sales DESC
LIMIT 10;

-- 4: plataformas con más ventas acumuladas y cantidad de juegos de cada una.
SELECT pl.code AS platform, COUNT(*) AS games,
       ROUND(SUM(v.global_sales), 1) AS total_sales
FROM v_game_sales v
JOIN platform pl ON pl.platform_id = v.platform_id
GROUP BY pl.code
ORDER BY total_sales DESC;

-- Análisis 
-- 1a: publisher con mayor venta global acumulada.
SELECT p.name AS publisher, COUNT(*) AS games,
       ROUND(SUM(v.global_sales), 2) AS total_sales,
       ROUND(AVG(v.global_sales), 2) AS average_sales
FROM v_game_sales v
JOIN publisher p ON p.publisher_id = v.publisher_id
GROUP BY p.publisher_id, p.name
ORDER BY total_sales DESC
LIMIT 10;

-- 1b: mismo ranking, pero por promedio de ventas por juego.
SELECT p.name AS publisher, COUNT(*) AS games,
       ROUND(SUM(v.global_sales), 2) AS total_sales,
       ROUND(AVG(v.global_sales), 2) AS average_sales
FROM v_game_sales v
JOIN publisher p ON p.publisher_id = v.publisher_id
GROUP BY p.publisher_id, p.name
ORDER BY average_sales DESC
LIMIT 10;

-- 1c: ranking por promedio solo con publishers de 10 juegos o más.
SELECT p.name AS publisher, COUNT(*) AS games,
       ROUND(SUM(v.global_sales), 2) AS total_sales,
       ROUND(AVG(v.global_sales), 2) AS average_sales
FROM v_game_sales v
JOIN publisher p ON p.publisher_id = v.publisher_id
GROUP BY p.publisher_id, p.name
HAVING COUNT(*) >= 10
ORDER BY average_sales DESC
LIMIT 10;

-- 2: plataforma con más juegos de Action publicados después de 2005.
SELECT pl.code AS platform, COUNT(*) AS games
FROM game_release g
JOIN platform pl ON pl.platform_id = g.platform_id
JOIN genre ge ON ge.genre_id = g.genre_id
WHERE ge.name = 'Action' AND g.release_year > 2005
GROUP BY pl.code
ORDER BY games DESC;

-- 3a: juegos que vendieron más en Japón que en Norteamérica.
SELECT g.name, pl.code AS platform, ge.name AS genre, g.jp_sales, g.na_sales
FROM game_release g
JOIN platform pl ON pl.platform_id = g.platform_id
JOIN genre ge ON ge.genre_id = g.genre_id
WHERE g.jp_sales > g.na_sales
ORDER BY g.jp_sales - g.na_sales DESC
LIMIT 20;

-- 3b: esos mismos juegos contados por género.
SELECT ge.name AS genre, COUNT(*) AS games
FROM game_release g
JOIN genre ge ON ge.genre_id = g.genre_id
WHERE g.jp_sales > g.na_sales
GROUP BY ge.name
ORDER BY games DESC;

-- 3c: esos mismos juegos contados por plataforma.
SELECT pl.code AS platform, COUNT(*) AS games
FROM game_release g
JOIN platform pl ON pl.platform_id = g.platform_id
WHERE g.jp_sales > g.na_sales
GROUP BY pl.code
ORDER BY games DESC;

-- 4: promedio de ventas globales y cantidad de juegos por género.
SELECT ge.name AS genre, COUNT(*) AS games,
       ROUND(AVG(v.global_sales), 3) AS average_sales
FROM v_game_sales v
JOIN genre ge ON ge.genre_id = v.genre_id
GROUP BY ge.name
ORDER BY average_sales DESC;