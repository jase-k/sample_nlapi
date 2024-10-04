const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Define the path to the data directory and database file
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'greetings.db');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory at ${dataDir}`);
}

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(
      `CREATE TABLE IF NOT EXISTS greetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table', err.message);
        } else {
          console.log('Greetings table ready.');
        }
      }
    );
  }
});

module.exports = db;