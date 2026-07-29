const fs = require('node:fs/promises');
const path = require('node:path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

class CsvStore {
  constructor(filePath, columns, deserialize = value => value, serialize = value => value) {
    this.filePath = filePath;
    this.columns = columns;
    this.deserialize = deserialize;
    this.serialize = serialize;
    this.writeQueue = Promise.resolve();
  }

  async ensureFile() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, stringify([], { header: true, columns: this.columns }));
    }
  }

  async readAll() {
    await this.ensureFile();
    const content = await fs.readFile(this.filePath, 'utf8');
    if (!content.trim()) return [];
    return parse(content, { columns: true, skip_empty_lines: true, trim: true })
      .map(this.deserialize);
  }

  async writeAll(records) {
    this.writeQueue = this.writeQueue.then(async () => {
      await this.ensureFile();
      const csv = stringify(records.map(this.serialize), {
        header: true,
        columns: this.columns
      });
      const temporary = `${this.filePath}.tmp`;
      await fs.writeFile(temporary, csv);
      await fs.rename(temporary, this.filePath);
    });
    return this.writeQueue;
  }
}

module.exports = { CsvStore };
