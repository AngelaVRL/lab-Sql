const REQUIRED_VARIABLES = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'CSV_PATH',
];

function readEnvironment() {
  const missingVariables = REQUIRED_VARIABLES.filter(
    (variableName) => process.env[variableName] === undefined
  );
  if (missingVariables.length > 0) {
    throw new Error(`Faltan variables en el archivo .env: ${missingVariables.join(', ')}`);
  }
  return process.env;
}

const environment = readEnvironment();

module.exports = {
  database: {
    host: environment.DB_HOST,
    port: Number(environment.DB_PORT),
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
  },
  csvPath: environment.CSV_PATH,
  tableNames: ['publisher', 'platform', 'genre', 'game_release'],
  batchSize: 1000,
  maxRejectedRowsShown: 20,
  releaseYearRange: { min: 1950, max: 2030 },
  missingValueMarkers: ['', 'N/A', 'NA', 'NAN'],
  unknownPublisherMarker: 'UNKNOWN',
};
