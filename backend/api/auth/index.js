import express from "express";
import { getUIDByCredentials, newSession, deleteSession, getUidBySessionId } from "../../db/auth.js";
import { getUserByUsername, insertUser } from "../../db/user.js";
import { getDbConnection } from "../../db/index.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Invalid request");
    return;
  }

  const db = getDbConnection();
  const uid = await getUIDByCredentials(db, { username, password });
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

authRouter.post("/register", async (req, res) => {

  const validationError = validateUser(req.body);
  if (validationError) {
    res.status(400).send(validationError);
    return;
  }

  const db = getDbConnection();
  try {
    const existingUser = await getUserByUsername(db, req.body.username)
    if (existingUser) {
      res.status(400).send("Username already exists");
      return;
    }

    await insertUser(db, req.body);
  } catch (error) {
    console.log("Failed to create user: ", error)
    res.status(500).send("Server Error");
    return;
  }

  res.status(201).send();
});

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,20}$/;
const NAME_PATTERN = /^[a-zA-Z][a-zA-Z '-]{1,49}$/;
const GENDERS = ['male', 'female', 'other']

function validateUser(user) {
  for (const field of ["firstName", "lastName", "username", "password", "gender"]) {
    if (typeof user[field] !== "string" || !user[field]) {
      return `${field} is required`
    }
  }

  if (!NAME_PATTERN.test(user.firstName)) {
    return "First name must start with a letter and be up to 50 letters, spaces, hyphens or apostrophes"
  }

  if (!NAME_PATTERN.test(user.lastName)) {
    return "Last name must start with a letter and be up to 50 letters, spaces, hyphens or apostrophes"
  }

  if (!USERNAME_PATTERN.test(user.username)) {
    return "Username must be 3-20 characters and only contain letters, numbers, dots, userscores or hyphens. "
  }

  const passwordError = validatePassword(user.password)
  if (passwordError) {
    return passwordError;
  }

  if (!GENDERS.includes(user.gender)) {
    return `Gender must be one of :${GENDERS.join(", ")}.`  // Gender must be one of male, female, others.
  }

  if (!isValidAvatarUrl(user.avatarUrl)) {
    return `Avatar URL must be a valid URL`
  }

  return null;
}

function validatePassword(password) {
  if (password.length < 8 || password.length > 20) {
    return `Password must be between 8 and 20 characters.`
  }

  if (!/[A-Z]/.test(password)) {
    return `Password must contain at least one uppercase letter.`
  }

  if (!/[a-z]/.test(password)) {
    return `Password must contain at least one uppercase letter.`
  }

  if (!/[0-9]/.test(password)) {
    return `Password must contain at least one uppercase letter.`
  }

  return null;
}

const MAX_URL_LENGTH = 2048

function isValidAvatarUrl(avatarUrl) {
  if (!avatarUrl) {
    return true;
  }

  if (typeof avatarUrl !== "string" || avatarUrl.length > MAX_URL_LENGTH) {
    return false;
  }

  try {
    const { protocol } = new URL(avatarUrl);
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false;
  }
}