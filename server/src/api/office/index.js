import express from "express";

import authHelper from "../helpers/auth";

import authorize from "./authorize";
import calendar from "./calendar";

const router = express.Router();

router.use(function timelog(req, res, next) {
  next();
});

router.use("/authorize", authorize);
router.use("/calendar", calendar);

// Get the URL to login to outlook services
router.get("/", async function(req, res, next) {
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    res.send({ accessToken, userName});
  } else {
    res.redirect(authHelper.getAuthUrl());
  }
});

export default router;
