import express from "express";

import shifts from "./shifts";
import employees from "./employees";

import office from "./office";

const router = express.Router();

router.use(function timelog(req, res, next) {
  console.log(`API access at ${Date.now()} from ${req.ip}`);
  next();
});

router.use("/office", office);
router.use("/shifts", shifts);
router.use("/employees", employees);
//router.use("/schedule", schedule);

export default router;
