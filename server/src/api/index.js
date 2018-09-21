import express from "express";

import shifts from "./shifts";
import employees from "./employees";

const router = express.Router();

router.use(function timelog(req, res, next) {
  console.log(`API access at ${Date.now()} from ${req.ip}`);
  next();
});

router.use("/shifts", shifts);
router.use("/employees", employees);

export default router;
