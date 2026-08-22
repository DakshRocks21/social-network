import express from "express";
import { userRouter } from "./user/index.js";
import { authRouter } from "./auth/index.js";
import { postRouter } from "./post/index.js";
import { getUidBySessionId } from "../db/auth.js";
import { getDbConnection } from "../db/index.js";
import { friendRouter } from "./friend/index.js";

export const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);

// Middleware to check if the user is authenticated - all of the routes following it require authentication
apiRouter.use((req, res, next) => {
  const sessionId = req.cookies.SID;
  if (!sessionId) {
    res.status(401).send("Unauthorized");
    return;
  }

  const db = getDbConnection();
  getUidBySessionId(db, sessionId).then((userId) => {
    if (!userId) {
      res.clearCookie("SID");
      res.status(401).send("Unauthorized");
      return;
    }

    req.userId = userId;
    next();
  }, () => {
    res.status(500).send("Server error");
  });
});

apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);
apiRouter.use("/friend", friendRouter);
