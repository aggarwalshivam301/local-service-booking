const fs = require('node:fs/promises');
const path = require('node:path');
const { query, closeDatabase } = require('./index');

const migrationsDirectory = path.join(__dirname, 'migrations');

const main = async () => {
  const files = (await fs.readdir(migrationsDirectory))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    throw new Error('No SQL migrations found');
  }

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDirectory, file), 'utf8');
    await query(sql);
    console.log(`Applied ${file}`);
  }
};

main()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
