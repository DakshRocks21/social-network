// For instructors only.
// Use this file to reset the database and load test data if needed.
// Students can have this file after they've completed `registration` exercise.
// If students use this file for `hashing` exercise, make sure that they know to replace `insertUser` function with the one they have by importing it.

import { syncSchema, getDbConnection } from "./db/index.js";
import { insertSession } from "./db/auth.js";
import { insertPost } from "./db/post.js";
import { insertFriends, insertFriendRequest } from "./db/friend.js";
import { config } from "./config/index.js";
import fs from "fs";

function insertUser(db, user) {
  db.run(
    `INSERT INTO users (firstName, lastName, username, password, gender, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)`,
    [user.firstName, user.lastName, user.username, user.password, user.gender, user.avatarUrl],
    (err) => {
      if (err) {
        console.error('Error inserting user:', err);
    } else {
        console.log('User inserted successfully');
      }
    }
  );
}

async function loadTestData() {
  console.log("Deleting database file");
  fs.rmSync(config.sqliteDbInfo.filename, { force: true });
  const db = getDbConnection();
  await syncSchema(db);
  console.log("Loading test data");
  db.serialize(() => {
    console.log("Loading users");
    loadUsers(db);
    console.log("Loading posts");
    loadPosts(db);
    console.log("Loading friends");
    loadFriends(db);
    console.log("Loading friend requests");
    loadFriendRequests(db);
    console.log("Loading sessions");
    loadSessions(db);
  });
}

function loadUsers(db) {
  const users = [
    {
      firstName: "Luciano",
      lastName: "Pacocha",
      username: "luciano.pacocha",
      password: "123456",
      gender: "male",
      avatarUrl:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/612.jpg",
    },
    {
      firstName: "Florence",
      lastName: "Jane",
      username: "florence1",
      gender: "female",
      password: "123456",
      avatarUrl:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/644.jpg",
    },
    {
      firstName: "Loraine",
      lastName: "Streich",
      username: "loraine.streich",
      gender: "female",
      password: "123456",
      avatarUrl:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/166.jpg",
    },
    {
      firstName: "Test",
      lastName: "User",
      username: "test",
      password: "123456",
      gender: "male",
      avatarUrl:
        "https://randomuser.me/api/portraits/lego/6.jpg",
    },
  ];
  users.forEach((user) => {
    insertUser(db, user);
  });
}

function loadPosts(db) {
  const postsData = [
    {
      content: `
      Reprehenderit distinctio omnis voluptas ipsa facilis velit.
      Aut aut molestiae sit magnam aliquam.
      Voluptates sit illum aspernatur dignissimos.
      Sint est sapiente suscipit ut odit occaecati dolorem quia.
          `,
      authorId: 1,
    },
    {
      content: `
      Voluptates unde reiciendis dignissimos aut rem.
      Eligendi officia quibusdam sed non possimus a.
      Nulla quo officiis.
      Ex qui pariatur quia magnam id facilis iste et.    
      Enim enim minima.
          `,
      authorId: 2,
    },
    {
      content: `
      Maxime est id quasi quae doloribus nostrum.
      Delectus saepe id est ut aut.
      Expedita numquam voluptate consectetur illo sed vitae asperiores.
          `,
      authorId: 3,
    },
    {
      content: `
      Non animi velit dolor repellendus.
      Vel aliquam autem hic reprehenderit similique.
      Perspiciatis fuga ea consequuntur voluptas inventore corrupti sit.
      Ex ipsa sit unde sunt dolore.
      Voluptatibus aut ducimus qui ut.
      Enim dignissimos et molestias officiis.
      Repudiandae ea dolores debitis omnis.
      Est eaque dolorum ex nemo porro in aut odit.Unde sed neque enim aspernatur qui expedita tempore ipsa adipisci.
      Excepturi in quis fugit repellendus.
      Molestias facere fugiat illum perferendis itaque repudiandae neque.
      Et voluptas labore est aliquid possimus id quidem.
          `,
      authorId: 2,
    },
    {
      content: `
      Reprehenderit distinctio omnis voluptas ipsa facilis velit.
      Aut aut molestiae sit magnam aliquam.
      Voluptates sit illum aspernatur dignissimos.
      Sint est sapiente suscipit ut odit occaecati dolorem quia.
          `,
      authorId: 1,
    },
    {
      content: `
      Voluptates unde reiciendis dignissimos aut rem.
      Eligendi officia quibusdam sed non possimus a.
      Nulla quo officiis.
      Ex qui pariatur quia magnam id facilis iste et.    
      Enim enim minima.
          `,
      authorId: 2,
    },
    {
      content: `
      Maxime est id quasi quae doloribus nostrum.
      Delectus saepe id est ut aut.
      Expedita numquam voluptate consectetur illo sed vitae asperiores.
          `,
      authorId: 3,
    },
    {
      content: `
      Non animi velit dolor repellendus.
      Vel aliquam autem hic reprehenderit similique.
      Perspiciatis fuga ea consequuntur voluptas inventore corrupti sit.
      Ex ipsa sit unde sunt dolore.
      Voluptatibus aut ducimus qui ut.
      Enim dignissimos et molestias officiis.
      Repudiandae ea dolores debitis omnis.
      Est eaque dolorum ex nemo porro in aut odit.Unde sed neque enim aspernatur qui expedita tempore ipsa adipisci.
      Excepturi in quis fugit repellendus.
      Molestias facere fugiat illum perferendis itaque repudiandae neque.
      Et voluptas labore est aliquid possimus id quidem.
          `,
      authorId: 2,
    },
    {
      content: `
      Reprehenderit distinctio omnis voluptas ipsa facilis velit.
      Aut aut molestiae sit magnam aliquam.
      Voluptates sit illum aspernatur dignissimos.
      Sint est sapiente suscipit ut odit occaecati dolorem quia.
          `,
      authorId: 1,
    },
    {
      content: `
      Voluptates unde reiciendis dignissimos aut rem.
      Eligendi officia quibusdam sed non possimus a.
      Nulla quo officiis.
      Ex qui pariatur quia magnam id facilis iste et.    
      Enim enim minima.
          `,
      authorId: 2,
    },
    {
      content: `
      Maxime est id quasi quae doloribus nostrum.
      Delectus saepe id est ut aut.
      Expedita numquam voluptate consectetur illo sed vitae asperiores.
          `,
      authorId: 3,
    },
    {
      content: `
      Non animi velit dolor repellendus.
      Vel aliquam autem hic reprehenderit similique.
      Perspiciatis fuga ea consequuntur voluptas inventore corrupti sit.
      Ex ipsa sit unde sunt dolore.
      Voluptatibus aut ducimus qui ut.
      Enim dignissimos et molestias officiis.
      Repudiandae ea dolores debitis omnis.
      Est eaque dolorum ex nemo porro in aut odit.Unde sed neque enim aspernatur qui expedita tempore ipsa adipisci.
      Excepturi in quis fugit repellendus.
      Molestias facere fugiat illum perferendis itaque repudiandae neque.
      Et voluptas labore est aliquid possimus id quidem.
          `,
      authorId: 2,
    },
    {
      content: `
      Reprehenderit distinctio omnis voluptas ipsa facilis velit.
      Aut aut molestiae sit magnam aliquam.
      Voluptates sit illum aspernatur dignissimos.
      Sint est sapiente suscipit ut odit occaecati dolorem quia.
          `,
      authorId: 1,
    },
    {
      content: `
      Voluptates unde reiciendis dignissimos aut rem.
      Eligendi officia quibusdam sed non possimus a.
      Nulla quo officiis.
      Ex qui pariatur quia magnam id facilis iste et.    
      Enim enim minima.
          `,
      authorId: 2,
    },
    {
      content: `
      Maxime est id quasi quae doloribus nostrum.
      Delectus saepe id est ut aut.
      Expedita numquam voluptate consectetur illo sed vitae asperiores.
          `,
      authorId: 3,
    },
    {
      content: `
      Non animi velit dolor repellendus.
      Vel aliquam autem hic reprehenderit similique.
      Perspiciatis fuga ea consequuntur voluptas inventore corrupti sit.
      Ex ipsa sit unde sunt dolore.
      Voluptatibus aut ducimus qui ut.
      Enim dignissimos et molestias officiis.
      Repudiandae ea dolores debitis omnis.
      Est eaque dolorum ex nemo porro in aut odit.Unde sed neque enim aspernatur qui expedita tempore ipsa adipisci.
      Excepturi in quis fugit repellendus.
      Molestias facere fugiat illum perferendis itaque repudiandae neque.
      Et voluptas labore est aliquid possimus id quidem.
          `,
      authorId: 2,
    },
  ];

  postsData.forEach((post) => {
    insertPost(db, post);
  });
}

function loadSessions(db) {
  const sessions = [
    {
      userId: 4,
      sessionId: "ab585c3964635054d9f253240536a8ce1a8cc9865a74960bbd2bf35d",
    },
  ];

  sessions.forEach((session) => {
    insertSession(db, session);
  });
}

function loadFriends(db) {
  const friends = [
    {
      user1: 1,
      user2: 4,
    },
    {
      user1: 2,
      user2: 4,
    },
  ];

  friends.forEach((pair) => {
    insertFriends(db, pair.user1, pair.user2);
  });
}

function loadFriendRequests(db) {
  const requests = [
    {
      fromUserId: 4,
      toUserId: 3,
    },
  ];

  requests.forEach((request) => {
    insertFriendRequest(db, request.fromUserId, request.toUserId);
  });
}

loadTestData();
