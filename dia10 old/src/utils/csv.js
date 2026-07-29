const fs = require("fs/promises");

async function readCsv(filePath) {
  const content = await fs.readFile(filePath, "utf8");

  const lines = content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  const headers = lines[0].split(",");

  const records = lines.slice(1).map((line) => {
    const values = line.split(",");

    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index];
    });

    return record;
  });

  return records;
}

module.exports = {
  readCsv
};