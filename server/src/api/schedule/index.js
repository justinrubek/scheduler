import express from "express";

import authHelper from "../helpers/auth";
import { greedy, busyWorkers } from "./selectors";

const graph = require("@microsoft/microsoft-graph-client");
const router = express.Router();


router.use(async function(req, res, next) {
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    next();
  } else {
    res.redirect(authHelper.getAuthUrl());
  }
});

async function getAvailability(startDateTime, endDateTime, workers, interval, accessToken) {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  const result = await client.api("/me/calendar/getschedule").version("beta")
    .post({
      Schedules: workers,
      // TODO: Change times to UTC
      StartTime: { dateTime: startDateTime, timeZone: "CST" },
      EndTime: { dateTime: endDateTime, timeZone: "CST" },
      availabilityViewInterval: interval
    });

  return result.value.reduce((accum, workerSchedule) => {
    const { scheduleId, availabilityView } = workerSchedule;
    accum[scheduleId] = [...availabilityView];
    return accum;
  }, {});
}

router.post("/createSchedule", async function(req, res, next) {
  const { strengthData, range, selectMethod } = req.body;
  const accessToken = await authHelper.getAccessToken(req.cookies, res);

  // Should we get the shift d
  let workers = [
    "rubejus@bvu.edu",
    "swanmat@bvu.edu",
    "mccokel@bvu.edu",
    "beebgar@bvu.edu",
    "watsbro@bvu.edu",
    "leemax@bvu.edu",
    "hoegmit@bvu.edu",
    "deanaus@bvu.edu",
    "bardnoa@bvu.edu",
    "heidkay@bvu.edu",
    "mccutan@bvu.edu",
    "martkev@bvu.edu",
    /*
    "snydcol@bvu.edu",
    "martmic2@bvu.edu",
    "horsbaz@bvu.edu",
     */
  ]

  const availability = await getAvailability(new Date(range.start).toISOString(), new Date(range.end).toISOString(), workers, 60, accessToken);
  const shifts = {};
  switch (selectMethod) {
    case "greedy":
    default:
      let s = await greedy(strengthData, range, availability, workers)
      Object.assign(shifts, s);
      break;
  }

  res.send(shifts);
  // res.send({ allShifts, hoursWorked, hoursUncovered, unable });
});


export default router;
