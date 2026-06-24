const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../db/irctc.db');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ SQLite Database connected');
    initializeDatabase();
  }
});

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('SQL Error:', err);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('SQL Error:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('SQL Error:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

async function initializeDatabase() {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT NOT NULL,
        phone TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        trainId TEXT NOT NULL,
        trainName TEXT NOT NULL,
        bookingDate DATETIME,
        journeyDate TEXT NOT NULL,
        passengers TEXT NOT NULL,
        seatClass TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        pnr TEXT UNIQUE,
        from_station TEXT,
        to_station TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS tatkal_reminders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        trainId TEXT NOT NULL,
        trainName TEXT NOT NULL,
        tatkalDate TEXT NOT NULL,
        tatkalTime TEXT NOT NULL,
        seatClass TEXT NOT NULL,
        passengers TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        status TEXT DEFAULT 'active',
        from_station TEXT,
        to_station TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        bookingId TEXT NOT NULL,
        userId TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'INR',
        status TEXT DEFAULT 'initiated',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bookingId) REFERENCES bookings(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS seats (
        id TEXT PRIMARY KEY,
        trainId TEXT NOT NULL,
        seatNumber TEXT NOT NULL,
        seatClass TEXT NOT NULL,
        status TEXT DEFAULT 'available',
        price REAL NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

module.exports = {
  run,
  get,
  all,
  db
};
