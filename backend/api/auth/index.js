import express from "express";
import { getUIDByCredentials, newSession, deleteSession, getUidBySessionId } from "../../db/auth.js";
import { getDbConnection } from "../../db/index.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Invalid request");
    return;
  }

  const db = getDbConnection();
  const uid = await getUIDByCredentials(db, {username, password});
  if (!uid) {
    res.status(401).send("Unauthorized");
    return;
  }

  const sessionId = await newSession(db, { username, id: uid });
  if (!sessionId) {
    res.status(500).send("Server error");
    return;
  }

  res.cookie("SID", sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  res.status(200).send();
});

authRouter.post("/logout", async (req, res) => {
  const sessionId = req.cookies.SID;
  if (!sessionId) {
    res.status(400).send("Session ID not found");
    return;
  }
  
  // Clear the cookie regardless of the session ID's validity
  res.clearCookie("SID");

  const db = getDbConnection();
  const userID = await getUidBySessionId(db, sessionId);
  if (!userID) {
    res.status(401).send("Invalid session ID");
    return;
  }

  deleteSession(db, sessionId);
  res.status(200).send();
});