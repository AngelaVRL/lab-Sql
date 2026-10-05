const { csvPath, tableNames, maxRejectedRowsShown } = require('./config/config');
const { pool, withTransaction } = require('./services/mysql.service');
const { readCsvRecords } = require('./services/csv.service');
const { validateRecords } = require('./validators/gameRelease.validator');
const { loadGameReleases } = require('./services/load.service');
const { countRows } = require('./dao/table.dao');

const TABLE_NAME_COLUMN_WIDTH = 14;

function printRejectedRows(rejectedRows) {
  rejectedRows
    .slice(0, maxRejectedRowsShown)
    .forEach(({ lineNumber, reason }) => console.warn(`  Línea ${lineNumber}: ${reason}`));
}

async function printTableCounts() {
  console.log('\n=== Verificación de la carga ===');
  for (const tableName of tableNames) {
    const total = await countRows(pool, tableName);
    console.log(`${tableName.padEnd(TABLE_NAME_COLUMN_WIDTH)} ${total}`);
  }
}

async function main() {
  const records = readCsvRecords(csvPath);
  console.log(`Filas leídas del CSV: ${records.length}`);

  const { validReleases, rejectedRows } = validateRecords(records);
  console.log(`Filas válidas: ${validReleases.length} | rechazadas: ${rejectedRows.length}`);
  printRejectedRows(rejectedRows);

  await withTransaction((connection) => loadGameReleases(connection, validReleases));

  await printTableCounts();
  console.log(
    `\nCSV: ${records.length} | cargadas: ${validReleases.length} | rechazadas: ${rejectedRows.length}`
  );
}

main()
  .catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());