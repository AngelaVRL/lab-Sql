const fs = require('node:fs');
const { parse } = require('csv-parse/sync');

function readCsvRecords(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return parse(content, { columns: true, skip_empty_lines: true, bom: true });
  } catch (error) {
    throw new Error(`No se pudo leer el CSV en ${filePath}: ${error.message}`);
  }
}

module.exports = { readCsvRecords };
