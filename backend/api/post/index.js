import express from "express";
import { getPosts, getPostsByUserIDs, insertPost, deletePost } from "../../db/post.js";
import { getFriendship, getFriends } from "../../db/friend.js";
import { getDbConnection } from "../../db/index.js";

export const postRouter = express.Router();

async function getFeed(db, req, res) {
  const friends = await getFriends(db, req.userId);
  const friendIds = friends.map((friend) => friend.friendId);
  const posts = await getPostsByUserIDs(db, friendIds);
  return res.json(posts);
}

postRouter.get("/", async (req, res) => {
  const db = getDbConnection();
  let userId = req.query.userId;
  
  if (!userId) {
    return getFeed(db, req, res);
  }

  if (isNaN(userId)) {
    res.status(400).send("Invalid userId");
    return;
  }

  userId = parseInt(userId);
  if (req.userId !== userId) {
    const areFriends = await getFriendship(db, req.userId, userId);
    if (!areFriends) {
      res.status(403).send("Not friends");
      return;
    }
  }

  const posts = await getPosts(db, { userIdFilter: userId });
  res.json(posts);
});

postRouter.post("/", async (req, res) => {
  const db = getDbConnection();
  const post = req.body;
  if (!post.content) {
    res.status(400).send("Post content is required");
    return;
  }

  post.authorId = req.userId;
  insertPost(db, post);
  res.status(201).send();
});

postRouter.delete("/:postId", async (req, res) => {
  const db = getDbConnection();
  const postId = req.params.postId;
  deletePost(db, postId, req.userId).then((success) => {
    if (success) {
      res.status(204).send();
    } else {
      res.status(403).send("Post not found");
    }
  });
});