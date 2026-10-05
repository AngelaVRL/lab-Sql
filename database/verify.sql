USE videojuegos;

SELECT 'publisher' AS table_name, COUNT(*) AS total FROM publisher
UNION ALL SELECT 'platform', COUNT(*) FROM platform
UNION ALL SELECT 'genre', COUNT(*) FROM genre
UNION ALL SELECT 'game_release', COUNT(*) FROM game_release;

SELECT SUM(release_year IS NULL) AS without_year,
       SUM(publisher_id IS NULL) AS without_publisher
FROM game_release;