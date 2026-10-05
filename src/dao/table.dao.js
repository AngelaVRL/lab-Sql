const { tableNames } = require('../config/config');

async function clearTables(connection) {
  const tablesChildFirst = [...tableNames].reverse();
  for (const tableName of tablesChildFirst) {
    await connection.query(`DELETE FROM ${tableName}`);
  }
}

async function countRows(connection, tableName) {
  const [[{ total }]] = await connection.query(`SELECT COUNT(*) AS total FROM ${tableName}`);
  return total;
}

module.exports = { clearTables, countRows };
