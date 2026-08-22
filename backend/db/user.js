import sqlite3 from "sqlite3";

/**
 * @param {sqlite3.Database} db
 */
export function createUserTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT,
          lastName TEXT,
          username TEXT,
          password TEXT,
          gender TEXT,
          avatarUrl TEXT
      )`);
}



/**
 * @param {sqlite3.Database} db
 */
export function getUsers(db, options) {
  const { limit = 10, offset = 0, filter = "" } = options ?? {};
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, firstName, lastName, gender, avatarUrl FROM users WHERE username like ? LIMIT ? OFFSET ?`,
      [`%${filter}%`, limit, offset],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

/**
 * @param {sqlite3.Database} db
 */
export function getUserById(db, id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id, firstName, lastName, gender, avatarUrl
                  FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}
