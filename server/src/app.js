import express from "express";
import path from "path";
import logger from "morgan";
import moment from "moment";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import bluebird from "bluebird";

import config from "./config";
import api from "./api";

const DB_NAME = "scheduler";
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // Successful connection
});

const public_folder = path.resolve(__dirname, "..", "..", "public");
const app = express();
app.locals.db_connection = db;

app.use(logger(config.logging_format));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(public_folder));

app.use("/api", api);

app.get("*", (req, res) => {
  console.log("Default route");
  res.sendFile(path.join(public_folder, "index.html"));
});

export default app;
