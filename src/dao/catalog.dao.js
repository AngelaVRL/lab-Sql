const CATALOGS = {
  publisher: { table: 'publisher', valueColumn: 'name', idColumn: 'publisher_id' },
  platform: { table: 'platform', valueColumn: 'code', idColumn: 'platform_id' },
  genre: { table: 'genre', valueColumn: 'name', idColumn: 'genre_id' },
};

async function insertCatalogValues(connection, catalog, values) {
  if (values.length > 0) {
    await connection.query(
      `INSERT INTO ${catalog.table} (${catalog.valueColumn}) VALUES ?`,
      [values.map((value) => [value])]
    );
  }
  const [rows] = await connection.query(
    `SELECT ${catalog.idColumn} AS id, ${catalog.valueColumn} AS label FROM ${catalog.table}`
  );
  return new Map(rows.map((row) => [row.label, row.id]));
}

module.exports = { CATALOGS, insertCatalogValues };
