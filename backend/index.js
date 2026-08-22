import express from "express";
import { apiRouter } from "./api/index.js";
import { config } from "./config/index.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors( {
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use("/api", apiRouter);

app.listen(config.listenPort, () => {
  console.log(`Server is running on port ${config.listenPort}`);
});
