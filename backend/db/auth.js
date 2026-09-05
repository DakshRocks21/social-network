import sqlite3 from "sqlite3";
import sha2 from "sha2";
import crypto from "crypto";

import { config } from "../config/index.js";

/**
 * @param {sqlite3.Database} db
*/
export function createSessionTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
          sessionId TEXT,
          userId INTEGER,
          FOREIGN KEY (userId) REFERENCES users(id)
      )`);
}

/**
 * @param {sqlite3.Database} db
 * @param {object} credentials
*/
export function generateSalt(length = 5) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const charactersLength = characters.length; // 88
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function hashPassword(input, salt = '') {
  const hash = crypto.createHash('sha256');
  hash.update(salt + input);
  return hash.digest('hex');
}

function getUserSaltByUsername(db, username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT salt FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        resolve(row.salt);
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * @param {sqlite3.Database} db
 * @param {object} credentials
*/
export function getUIDByCredentials(db, credentials) {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await getUserSaltByUsername(db, credentials.username);

      if (salt === null) {
        // Username not found, or the row predates hashing and has no salt
        resolve(null);
        return;
      }

      const hashedPassword = hashPassword(credentials.password, salt);

      db.get(
        `SELECT id FROM users WHERE username = ? AND password = ?`,
        [credentials.username, hashedPassword],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (row) {
            resolve(row.id);
          } else {
            resolve(null);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @param {sqlite3.Database} db
 * @param {string} sessionId
*/
export function deleteSession(db, sessionId) {
  db.run(
    `DELETE FROM sessions WHERE sessionId = ?`, 
    [sessionId]
  );
}

/**
 * @param {sqlite3.Database} db
 * @param {object} user
*/
export function newSession(db, user) {
  return new Promise((resolve, reject) => {
    if (!user.username) {
      reject("Username is required");
      return;
    }

    if (!user.id) {
      reject("User ID is required");
      return;
    }

    const sessionId = generateSessionId(user.username);
    if (!sessionId) {
      reject("Failed to generate session id");
      return;
    }

    assignSessionToUser(db, { sessionId, userId: user.id })
      .then(() => {
        resolve(sessionId);
      })
      .catch((error) => {
        reject(error);
      });
  })
}

/**
 * @param {sqlite3.Database} db
 * @param {string} sessionId
*/
export function getUidBySessionId(db, sessionId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT userId FROM sessions WHERE sessionId = ?`, [sessionId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        resolve(row.userId);
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * @param {sqlite3.Database} db
 * @param {object} session
 * */
export function insertSession(db, session) {
  db.run(
    `INSERT INTO sessions (sessionId, userId) VALUES (?, ?)`,
    [session.sessionId, session.userId]
  );
}

function getSessionByUserID(db, userId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM sessions WHERE userId = ?`, [userId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (!row) {
        resolve(null);
        return;
      }

      else {
        resolve(row);
      }
    });
  });
}

function updateSession(db, session) {
  db.run(
    `UPDATE sessions SET sessionId = ? WHERE userId = ?`,
    [session.sessionId, session.userId]
  );
}

function assignSessionToUser(db, session) {
  return new Promise((resolve, reject) => {
    getSessionByUserID(db, session.userId)
      .then((existingSession) => {
        if (existingSession) {
          updateSession(db, session);
        } else {
          insertSession(db, session);
        }

        resolve();
    })
    .catch((error) => {
      reject(error);
    });
  });
}

function generateSessionId(username) {
  const sessionIdBuffer = sha2.sha224(username + Date.now() + config.sessionSalt);
  return sessionIdBuffer.toString("hex");
}
