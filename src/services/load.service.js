const { CATALOGS, insertCatalogValues } = require('../dao/catalog.dao');
const { clearTables, countRows } = require('../dao/table.dao');
const { GAME_RELEASE_TABLE, insertGameReleases } = require('../dao/gameRelease.dao');

function getUniqueValues(releases, fieldName) {
  const values = releases
    .map((release) => release[fieldName])
    .filter((value) => value !== null);
  return [...new Set(values)];
}

async function insertCatalogs(connection, releases) {
  const publisherIds = await insertCatalogValues(
    connection, CATALOGS.publisher, getUniqueValues(releases, 'publisherName'));
  const platformIds = await insertCatalogValues(
    connection, CATALOGS.platform, getUniqueValues(releases, 'platformCode'));
  const genreIds = await insertCatalogValues(
    connection, CATALOGS.genre, getUniqueValues(releases, 'genreName'));
  return { publisherIds, platformIds, genreIds };
}

function toGameReleaseRow(release, catalogIds) {
  const { publisherIds, platformIds, genreIds } = catalogIds;
  const publisherId = release.publisherName === null
    ? null
    : publisherIds.get(release.publisherName);

  return [
    release.name,
    release.releaseYear,
    platformIds.get(release.platformCode),
    genreIds.get(release.genreName),
    publisherId,
    release.naSales,
    release.euSales,
    release.jpSales,
    release.otherSales,
  ];
}

async function loadGameReleases(connection, releases) {
  await clearTables(connection);
  const catalogIds = await insertCatalogs(connection, releases);
  const rows = releases.map((release) => toGameReleaseRow(release, catalogIds));
  await insertGameReleases(connection, rows);

  const insertedTotal = await countRows(connection, GAME_RELEASE_TABLE);
  if (insertedTotal !== releases.length) {
    throw new Error(`Se esperaban ${releases.length} registros y se insertaron ${insertedTotal}`);
  }
}

module.exports = { loadGameReleases };
