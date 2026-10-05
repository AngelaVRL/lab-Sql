const {
  releaseYearRange,
  missingValueMarkers,
  unknownPublisherMarker,
} = require('../config/config');

const FIRST_DATA_LINE = 2;

function cleanText(rawValue) {
  const text = String(rawValue ?? '').trim();
  return missingValueMarkers.includes(text.toUpperCase()) ? null : text;
}

function requireText(rawValue, fieldName) {
  const text = cleanText(rawValue);
  if (text === null) {
    throw new Error(`${fieldName} vacío`);
  }
  return text;
}

function parseReleaseYear(rawValue) {
  const text = cleanText(rawValue);
  if (text === null) {
    return null;
  }
  const year = Number(text);
  const isInRange = year >= releaseYearRange.min && year <= releaseYearRange.max;
  if (!Number.isInteger(year) || !isInRange) {
    throw new Error(`Año inválido: "${text}"`);
  }
  return year;
}

function parseSales(rawValue, fieldName) {
  const text = cleanText(rawValue);
  const sales = Number(text);
  if (text === null || !Number.isFinite(sales) || sales < 0) {
    throw new Error(`${fieldName} inválido: "${rawValue}"`);
  }
  return sales;
}

function parsePublisherName(rawValue) {
  const text = cleanText(rawValue);
  if (text === null || text.toUpperCase() === unknownPublisherMarker) {
    return null;
  }
  return text;
}

function validateRecord(record) {
  return {
    name: requireText(record.Name, 'Name'),
    platformCode: requireText(record.Platform, 'Platform'),
    genreName: requireText(record.Genre, 'Genre'),
    publisherName: parsePublisherName(record.Publisher),
    releaseYear: parseReleaseYear(record.Year),
    naSales: parseSales(record.NA_Sales, 'NA_Sales'),
    euSales: parseSales(record.EU_Sales, 'EU_Sales'),
    jpSales: parseSales(record.JP_Sales, 'JP_Sales'),
    otherSales: parseSales(record.Other_Sales, 'Other_Sales'),
  };
}

function validateRecords(records) {
  const validReleases = [];
  const rejectedRows = [];

  records.forEach((record, index) => {
    try {
      validReleases.push(validateRecord(record));
    } catch (error) {
      rejectedRows.push({ lineNumber: index + FIRST_DATA_LINE, reason: error.message });
    }
  });

  return { validReleases, rejectedRows };
}

module.exports = { validateRecords };
