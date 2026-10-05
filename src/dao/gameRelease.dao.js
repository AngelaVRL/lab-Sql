const { batchSize } = require('../config/config');

const GAME_RELEASE_TABLE = 'game_release';

const INSERT_STATEMENT = `
  INSERT INTO ${GAME_RELEASE_TABLE}
  (name, release_year, platform_id, genre_id, publisher_id,
   na_sales, eu_sales, jp_sales, other_sales)
  VALUES ?`;

async function insertGameReleases(connection, rows) {
  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = rows.slice(start, start + batchSize);
    await connection.query(INSERT_STATEMENT, [batch]);
  }
}

module.exports = { GAME_RELEASE_TABLE, insertGameReleases };
