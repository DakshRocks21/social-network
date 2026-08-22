import express from "express";
import {getFriends, insertFriends, getFriendRequest, insertFriendRequest, deleteFriendRequest, getFriendship, deleteFriendship, getFriendRequests} from "../../db/friend.js";
import {getUserById} from "../../db/user.js";
import { getDbConnection } from "../../db/index.js";

export const friendRouter = express.Router();

// Get friends API
friendRouter.get("/", async (req, res) => {
  const db = getDbConnection();
  const friends = await getFriends(db, req.userId);
  res.json(friends);
});

// Add friend / confirm friend requests API
friendRouter.post("/addFriend", async (req, res) => {
  const db = getDbConnection();
  const friendId = req.body.friendId;

  if (!friendId) {
    res.status(400).send("Friend ID is required");
    return;
  }

  if (friendId === req.userId) {
    res.status(400).send("Cannot add yourself as a friend");
    return;
  }

  // Check if the friendId exists
  if (!await getUserById(db, friendId)) {
    res.status(400).send("Friend ID does not exist");
    return;
  }
  
  // Check if the friend is already added
  if (await getFriendship(db, req.userId, friendId)) {
    res.status(400).send("Friend is already added");
    return;
  }

  // Check if the friend request already sent
  const alreadySentRequest = await getFriendRequest(db, req.userId, friendId);
  if (alreadySentRequest) {
    res.status(400).send("Friend request already sent");
    return;
  }

  // Check if friend request should be confirmed
  const friendRequest = await getFriendRequest(db, friendId, req.userId);
  if (friendRequest) {
    // Delete the friend request and add as a friend
    deleteFriendRequest(db, friendRequest.id);
    insertFriends(db, req.userId, friendRequest.fromUserId);
    res.sendStatus(200);
    return;
  }
  
  // Insert the friend request
  insertFriendRequest(db, req.userId, friendId);
  res.sendStatus(200);
});

// Delete friend / friend requests API
friendRouter.post("/deleteFriend", async (req, res) => {
  const db = getDbConnection();
  const otherId = req.body.otherId;

  if (!otherId) {
    res.status(400).send("Other ID is required");
    return;
  }

  if (otherId === req.userId) {
    res.sendStatus(400);
    return;
  }

  // Check if user wants to delete a friend request (either sent or received)
  const request = await getFriendRequest(db, req.userId, otherId) || await getFriendRequest(db, otherId, req.userId);
  if (request) {
    deleteFriendRequest(db, request.id);
    res.sendStatus(200);
    return;
  }

  // If otherId is not a friend (and was not a friend request), return an error
  const friendship = await getFriendship(db, req.userId, otherId);
  if (!friendship) {
    res.sendStatus(400);
    return;
  }

  // Delete the friendship
  deleteFriendship(db, friendship.id);
  res.sendStatus(200);
});

// Get friend requests API
friendRouter.get("/requests", async (req, res) => {
  const db = getDbConnection();
  const requests = await getFriendRequests(db, req.userId);
  res.json(requests);
});