import sqlite3 from "sqlite3";

function createFriendTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId1 INTEGER NOT NULL,
            userId2 INTEGER NOT NULL,
            UNIQUE (userId1, userId2),
            CHECK (userId1 < userId2),
            FOREIGN KEY (userId1) REFERENCES users(id),
            FOREIGN KEY (userId2) REFERENCES users(id)
      )`);
}

function createRequestTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS friendRequests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromUserId INTEGER NOT NULL,
        toUserId INTEGER NOT NULL,
        UNIQUE (fromUserId, toUserId),
        CHECK (fromUserId != toUserId),
        FOREIGN KEY (fromUserId) REFERENCES users(id),
        FOREIGN KEY (toUserId) REFERENCES users(id)
      )`);
}

/**
 * @param {sqlite3.Database} db
 */
export function createFriendTables(db) {
  createFriendTable(db);
  createRequestTable(db);
}

/**
 * @param {sqlite3.Database} db
 * @param {number} userId1
 * @param {number} userId2
 */
export function insertFriends(db, userId1, userId2) {
  db.run(
    `INSERT OR IGNORE INTO friends (userId1, userId2) VALUES (?, ?)`,
    [Math.min(userId1, userId2), Math.max(userId1, userId2)]
  );
}

/**
 * @param {sqlite3.Database} db
 * @param {number} userId1
 * @param {number} userId2
 */
export function getFriendship(db, userId1, userId2) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id FROM friends WHERE userId1 = ? AND userId2 = ?`,
      [Math.min(userId1, userId2), Math.max(userId1, userId2)],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });

}

/**
 * @param {sqlite3.Database} db
 * @param {number} friendshipId
 */
export function deleteFriendship(db, friendshipId) {
  db.run(
    `DELETE FROM friends WHERE id = ?`,
    [friendshipId]
  );
}

/**
 * @param {sqlite3.Database} db
 * @param {number} fromUserId
 * @param {number} toUserId
 */
export function insertFriendRequest(db, fromUserId, toUserId) {
  db.run(
    `INSERT INTO friendRequests (fromUserId, toUserId) VALUES (?, ?)`,
    [fromUserId, toUserId]
  );
}

/**
 * @param {sqlite3.Database} db
 * @param {number} requestId
 */
export function deleteFriendRequest(db, requestId) {
  db.run(
    `DELETE FROM friendRequests WHERE id = ?`,
    [requestId]
  );
}

/**
 * @param {sqlite3.Database} db
 * @param {number} fromUserId
 * @param {number} toUserId
 */
export function getFriendRequest(db, fromUserId, toUserId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM friendRequests WHERE fromUserId = ? AND toUserId = ?`,
      [fromUserId, toUserId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
}

/**
 * @param {sqlite3.Database} db
 * @param {number} userId
 */
export function getFriends(db, userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM friends JOIN users ON (userId1 = users.id OR userId2 = users.id) WHERE (userId1 = ? OR userId2 = ?) AND users.id != ?`,
      [userId, userId, userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(transformFriendships(rows, userId));
      }
    )});
}

/**
 * @param {sqlite3.Database} db
 * @param {number} userId
 */
export function getFriendRequests(db, userId) {
  return Promise.all([
    getIncomingFriendRequests(db, userId),
    getOutgoingFriendRequests(db, userId)
  ]).then(([incoming, outgoing]) => {
    return { incoming, outgoing };
  });
}

function getIncomingFriendRequests(db, userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM friendRequests JOIN users ON toUserId = users.id WHERE fromUserId = ?`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(transformFriendRequests(rows, userId));
      }
    );
  });
}

function getOutgoingFriendRequests(db, userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM friendRequests JOIN users ON fromUserId = users.id WHERE toUserId = ?`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(transformFriendRequests(rows, userId));
      }
    );
  });
}

function transformFriendships(rows, userId) {
  return rows.map(row => {
    return {
      friendId: row.userId1 === userId ? row.userId2 : row.userId1,
      fullName: `${row.firstName} ${row.lastName}`
    };
  });
}

function transformFriendRequests(rows, userId) {
  return rows.map(row => {
    return {
      otherId: userId === row.fromUserId ? row.toUserId : row.fromUserId,
      fullName: `${row.firstName} ${row.lastName}`
    };
  });
}