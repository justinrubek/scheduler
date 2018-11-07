import express from "express";
const router = express.Router();

/* import ohelper from "../helpers/office";

router.post("/", async function(req, res, next) {
  const start = req.query.start;
  const end = req.query.end;

  
  /*
    // Use this format, or schedule will be
    schedule: {
      "2018-11-07": [
          { start: "09:00", end: "11:00", worker: "justinr@bvu.edu" },
          { start: "11:00", end: "13:00", worker: "garrettb@bvu.edu" },
        ],
      "2018-11-08": [
          { start: "09:00", end: "11:00", worker: "justinr@bvu.edu" },
          { start: "11:00", end: "13:00", worker: "garrettb@bvu.edu" },
        ],
      
    };
  const schedule = {
    
  };

});
*/

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
