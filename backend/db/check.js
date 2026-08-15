const { checkDatabase, closeDatabase } = require('./index');

checkDatabase()
  .then(() => console.log('PostgreSQL connection is healthy'))
  .catch((error) => {
    console.error('PostgreSQL connection failed:', error.message);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
