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
 * @param {{firstName: string, lastName: string, username: string, password: string, gender: string, avatarUrl: string}} user
 */
export function insertUser(db, user) {
  return new Promise((resolve, reject) => {
    db.all(
      `INSERT into users (firstName, lastName, username, password, gender, avatarUrl)
        VALUES (?, ?, ?, ?, ?, ?)`, [user.firstName, user.lastName, user.username, user.password, user.gender, user.avatarUrl],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.id);
      }
    );
  });
}

/**
 * Exact match lookup for users based on their usernames
 * @param {sqlite3.Database} db
 */
export function getUserByUsername(db, username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id, firstName, lastName, gender, avatarUrl
                  FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
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
