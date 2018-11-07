import express from "express";
import authHelper from "../helpers/auth";

const graph = require("@microsoft/microsoft-graph-client")

const router = express.Router();

const STA_GROUP_ID = "1784af82-4e82-42bc-a695-91e3107952b8";
async function getStaIds(accessToken, userName) {
  if (accessToken && userName) {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const result = await client
      .api(`/groups/${STA_GROUP_ID}/members`)
      .get();

    return result;
  } 
}

router.get("/schedules", async function (req, res, next) {

  let resp = {};
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    try {
      const result = await client
        .api("/groups/1784af82-4e82-42bc-a695-91e3107952b8/members")
        .get();

      const start = new Date(new Date().setHours(0, 0, 0));
      const end = new Date(new Date(start).setDate(start.getDate() + 7));

      const sched = [];
      for (let user of result.value) {
        let u = {};
        u.id = user.id;
        let s = await client
          .api(`/users/${user.id}/calendar/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
          .select("subject,start,end")
          .get();
        u.schedule = s;
      }
      res.send(sched);
    } catch (err) {
      console.log(err)
      res.status(500).send(err.body)
    }

  } else {
    res.redirect("/");
  }
});

router.get("/sta", async function (req, res, next) {

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    const result = await getStaIds(accessToken, userName);
    res.send(result);
  } else {
    res.redirect("/");
  }
});

router.get("/users", async function (req, res, next) {

  let resp = {};
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    try {
      const result = await client
        .api("/me/getMemberGroups")
        .post({ securityEnabledOnly: false  });

      let groupInfo = []
      for (let group of result.value) {
        groupInfo.push(await client.api(`/groups/${group}`).get())
      }
      res.send(groupInfo);
    } catch (err) {
      console.log(err)
      res.status(500).send(err.body)
    }

  } else {
    res.redirect("/");
  }
});

router.get("/", async function(req, res, next) {
  let resp = {};
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    //const start = new Date(new Date().setHours(0, 0, 0));
    //const end = new Date(new Date(start).setDate(start.getDate() + 7));
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const interval = req.query.i;
    console.log(start);
    console.log(end);

    try {
      /*
        // Get my calendar schedule for the next 7 days
      const result = await client
      .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
      .select("subject,start,end")
      .orderby("start/dateTime DESC")
      .get();
       */
      const worker_emails = [
        "rubejus@bvu.edu",
        "swanmat@bvu.edu",
        "mccokel@bvu.edu",
        "beebgar@bvu.edu",
        "watsbro@bvu.edu",
        "gliebra@bvu.edu",
      ];

      const result = await client
        .api("/me/calendar/getschedule")
        .version("beta")
        .post({
          Schedules: worker_emails,
          StartTime: { dateTime: start, timeZone: "UTC" },
          EndTime: { dateTime: end, timeZone: "UTC" },
          availabilityViewInterval: interval
        });

      res.send({ "entries": result.value });
    } catch (err) {
      res.status(500).send(err.body);
    }
  } else {
    res.redirect("/");
  }
});

export default router;
