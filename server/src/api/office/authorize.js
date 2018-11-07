import express from "express";
import authHelper from "../helpers/auth";

const router = express.Router();

router.get("/", async function(req, res, next) {
  const code = req.query.code;
  if (code) {
    let token;

    try {
      token = await authHelper.getTokenFromCode(code, res)
      res.redirect("/dashboard");
    } catch (error) {
      res.redirect("/authError");
    }
    
  } else {
    res.send(500);
  }
});

router.get("/signout", function(req, res, next) {
  authHelper.clearCookies(res);

  res.redirect("/");
});

export default router;
