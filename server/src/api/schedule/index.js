import express from "express";
import moment from "moment-timezone";

import authHelper from "../helpers/auth";
import { greedy, busyWorkers } from "./selectors";

const graph = require("@microsoft/microsoft-graph-client");
const router = express.Router();

// import ohelper from "../helpers/office";
import { dateValidator as validDate, timeValidator as validTime } from "../validators";

function validSegments(segments) {
  let valid = true;

  segments.forEach(segment => {
    if (validTime(segment.start) && validTime(segment.end) && segment.strength > 0) {
    } else {
      valid = false
    }
  });
  return valid;
}

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

async function greedy(strengthData, range, availability, workers) {
  Object.keys(strengthData).forEach(dateString => {
    if (validDate(dateString) && validSegments(strengthData[dateString])) {
      // Good!
    } else {
      // Our data is bad somehow 
    }
  });


  // TODO: Validate range data

  // Get the availability view of the workers on the time range
  // Then, for each segment find the indices on this array that
  // corresponds with its time
  /*
    getAvailability(Monday 8AM to 5PM, ...) = 
       { "rubejus@bvu.edu": ["2", "2", "2", ... ], ... }
   */

  const adjustAvailability = (workerId, index, length) => {
    availability[workerId] = availability[workerId].map((hour, i) => {
      if (i >= index && i < index+length) {
        return 2;
      }
      return hour;
    }) ;
  }

  const isAvailable = (workerId, startIndex, duration) => {
    return availability[workerId].slice(startIndex, startIndex+duration).every(hour => hour == 0);
  }

  const formatMoment = mom => mom.format("MMMM Do YYYY, h:mm:ss a")


  // Start all workers as having 0 hours this schedule
  // May need to adjust to function as a priority queue
  const hoursWorked = workers.map(email => ({ id: email, hours: 0 }));
  const sortByHours = () => hoursWorked.sort((a, b) => a.hours - b.hours);

  const allShifts = [];
  const unable = {}

  let hoursUncovered = 0;

  // Some stuff to help
  const dateTime = (date, time) => `${date}T${time}:00`;
  const availabilityStart = moment(new Date(range.start));
  // TODO: Validate data first
  
  Object.keys(strengthData).forEach(dateString => {
    if (validDate(dateString) && validSegments(strengthData[dateString])) {
      // Proceed to the next stage
      strengthData[dateString].forEach(segment => {
        // Find the index of the availability array corresponding to this segment's starting time
        let startDateString = dateTime(dateString, segment.start);
        let endDateString = dateTime(dateString, segment.end);

        let segmentStart = moment(new Date(startDateString));
        let segmentEnd = moment(new Date(endDateString));

        let index = moment.duration(segmentStart.diff(availabilityStart)).asHours();
        let size = moment.duration(segmentEnd.diff(segmentStart)).asHours();

        // Now, greedily find workers to fill this segment
        for (let i = 0; i < segment.strength; i++) {
          let hoursCovered = 0;

          while (hoursCovered < size) {
            for (let shiftLength = size - hoursCovered; shiftLength > 0; shiftLength--) {
              // Look at each employee by minimum number of hours in this schedule so far
              // Check if they are available from index + hoursCovered to index+shiftLength
              // If so, increment hoursCovered by shiftLength and mark down the workerId, shift start, and duration
              let found = false;
              sortByHours();
              let shiftStart = moment(availabilityStart).add(index+hoursCovered, "hours");

              for (let worker of hoursWorked) {
                if (isAvailable(worker.id, index+hoursCovered, shiftLength)) {
                  // This is our worker!
                  found = true;

                  allShifts.push({ id: worker.id, start: shiftStart,
                    dateString: dateString, duration: shiftLength});

                  // Update the availability string of this worker so they do not get picked twice.
                  adjustAvailability(worker.id, index+hoursCovered, shiftLength);
                  
                  worker.hours += shiftLength;
                  hoursCovered += shiftLength;
                  break;
                }
              }

              if (found)
                break;
              else {
                if (shiftLength == 1) {
                  // Advance the "hours covered" count by one, and restart the search
                  let key = formatMoment(shiftStart);
                  if (unable[key]) {
                    unable[key]++;
                  } else {
                    unable[key] = 1;
                  }

                  // allShifts.push({ at: formatMoment(shiftStart), status: "Unable to find", });
                  hoursCovered++;
                  hoursUncovered++;

                }
              }


            }
            if (hoursCovered >= size)
              break;
          }
        }

      });

    } else {
      // Something is bad about the data

    }
  });
  return { allShifts, hoursWorked, hoursUncovered, unable };

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
    /*
    "watsbro@bvu.edu",
    "leemax@bvu.edu",
    "hoegmit@bvu.edu",
    "deanaus@bvu.edu",
    "snydcol@bvu.edu",
     */
    "martmic2@bvu.edu",
    "horsbaz@bvu.edu",
  ]

  const availability = await getAvailability(new Date(range.start).toISOString(), new Date(range.end).toISOString(), workers, 60, accessToken);
  const shifts = {};
  switch (selectMethod) {
    case "busy":
      let s = await busyWorkers(strengthData, range, availability, workers);
      Object.assign(shifts, s);
      break;
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
