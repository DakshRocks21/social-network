import express from "express";
import { getUserById, getUsers } from "../../db/user.js";
import { getFriendship } from "../../db/friend.js";
import { getDbConnection } from "../../db/index.js";

export const userRouter = express.Router();

userRouter.get("/all", async (req, res) => {
  const db = getDbConnection();
  const users = await getUsers(db, {filter: req.query.q});
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const db = getDbConnection();
  if (isNaN(req.params.id)) {
    res.status(400).send("Invalid user");
    return;
  }

  let user = await getUserById(db, req.params.id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  user.isFriend = await getFriendship(db, req.userId, req.params.id) ? true : false;
  res.json(user);
});

userRouter.get("/", async (req, res) => {
  const db = getDbConnection();
  const currentUser = await getUserById(db, req.userId);
  return res.json(currentUser);  
});