import sqlite3 from "sqlite3";

/**
 * @param {sqlite3.Database} db
 */
export function createPostTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          authorId INTEGER NOT NULL,
          creationTime TIMESTAMP DEFAULT (strftime('%s', 'now')),
          FOREIGN KEY (authorId) REFERENCES users(id)
      )`);
}

/**
 * @param {sqlite3.Database} db
 * @param {{content: string, authorId: number}} post
 */
export function insertPost(db, post) {
  db.run(`INSERT INTO posts (content, authorId) VALUES (?, ?)`, [
    post.content,
    post.authorId,
  ]);
}

/**
 * @param {sqlite3.Database} db
 * @param {number} postId
 * @param {number} authorId
 */
export function deletePost(db, postId, authorId) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM posts WHERE id = ? AND authorId = ?`, [postId, authorId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(this.changes > 0);
    });
  });
}

export function getPostsByUserIDs(db, userIds, options) {
  const { limit = 50, offset = 0 } = options ?? {};
  const placeholders = userIds.map(() => '?').join(',');
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
      posts.id, posts.content, posts.creationTime, posts.authorId, users.\"firstName\", users.\"lastName\", users.\"gender\", users.\"avatarUrl\" FROM posts join users on posts.authorId = users.id WHERE posts.authorId IN (${placeholders}) LIMIT ? OFFSET ?`,
      [...userIds, limit, offset],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(rows.map(transformPostWithUser));
      }
    );
  });
}

/**
 * @param {sqlite3.Database} db
 * @param {{limit?: number, offset?: number, userIdFilter?: number}} options
 */
export function getPosts(db, options) {
  const { limit = 50, offset = 0, userIdFilter } = options ?? {};
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
      posts.id, posts.content, posts.creationTime ${ userIdFilter === undefined ? ", posts.authorId, users.\"firstName\", users.\"lastName\", users.\"gender\", users.\"avatarUrl\" FROM posts join users on posts.authorId = users.id" : "FROM posts WHERE posts.authorId = ?" } LIMIT ? OFFSET ?`,
      [...(userIdFilter !== undefined ? [userIdFilter] : []), limit, offset],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(userIdFilter ? rows : rows.map(transformPostWithUser));
      }
    );
  });
}


function transformPostWithUser(row) {
  return {
    id: row.id,
    content: row.content,
    creationTime: row.creationTime,
    author: {
      id: row.authorId,
      firstName: row.firstName,
      lastName: row.lastName,
      avatarUrl: row.avatarUrl,
    },
  };
}
