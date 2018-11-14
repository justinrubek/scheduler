import express from "express";
import moment from "moment-timezone";
import authHelper from "../helpers/auth";
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
    accum[scheduleId] = availabilityView;
    console.log(`${scheduleId}: ${availabilityView}`);
    return accum;
  }, {});
}

router.post("/createSchedule", async function(req, res, next) {
  /*
    strengthData: {
      "2018-11-07": [
          { start: "09:00", end: "11:00" },
          { start: "11:00", end: "13:00" },
        ],
      "2018-11-08": [
          { start: "09:00", end: "11:00" },
          { start: "11:00", end: "13:00" },
        ],
      
    };
*/
  
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const { strengthData, range } = req.body;

  // TODO: Validate range data

  // Get the availability view of the workers on the time range
  // Then, for each segment find the indices on this array that
  // corresponds with its time
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
    */
    "martmic2@bvu.edu",
    "horsbaz@bvu.edu",
  ]

  /*
    getAvailability(Monday 8AM to 5PM, ...) = 
       { "rubejus@bvu.edu": "222000000", ... }
  */
  const availability = await getAvailability(new Date(range.start).toISOString(), new Date(range.end).toISOString(), workers, 60, accessToken);

  // Start all workers as having 0 hours this schedule
  // May need to adjust to function as a priority queue
  const hoursWorked = workers.map(email => ({ id: email, hours: 0 }));
  const sortByHours = () => hoursWorked.sort((a, b) => a.hours - b.hours);
  
  const allShifts = [];
  
  // Some stuff to help
  const dateTime = (date, time) => `${date}T${time}:00`;
  const availabilityStart = moment(new Date(range.start));
  // Validate strength data
  Object.keys(strengthData).forEach(dateString => {
    if (validDate(dateString) && validSegments(strengthData[dateString])) {
      // Proceed to the next stage
      strengthData[dateString].forEach(segment => {
        // TODO: Find the indices of the availability array corresponding to this segment
        // then, get slices of the array for each worker, their availability for this segment's
        // time frame.
        console.log(segment);
        let startDateString = dateTime(dateString, segment.start);
        let endDateString = dateTime(dateString, segment.end);
        // console.log(startDateString, endDateString)
        
        let segmentStart = moment(new Date(startDateString));
        let segmentEnd = moment(new Date(endDateString));
        
        let index = moment.duration(segmentStart.diff(availabilityStart)).asHours();
        let size = moment.duration(segmentEnd.diff(segmentStart)).asHours();

        console.log(`Start: ${segmentStart.format("YYYY-MM-DDTHH:MM:SS")} index: ${index} size: ${size}`);

        // Now, greedily pull
        let hoursCovered = 0;

        const isAvailable = (workerId, startIndex, duration) => {
          console.log(workerId, startIndex, duration);
          /*
          let avail = availability[workerId].slice(startIndex, startIndex+duration);
          console.log(avail);
          // return avail.every(hour => hour == 0);
          for (let i of avail) {
            if (i != 0)
              return false;
          }
          return true;
          */
          for (let i = startIndex; i < startIndex+duration; i++) {
            if (workerId == "beebgar@bvu.edu")
              console.log(availability[workerId][i]);
            if (availability[workerId][i] != 0) {
              return false;
            }
          }
          return true;
        }

        const formatMoment = mom => mom.format("MMMM Do YYYY, h:mm:ss a")
        while (hoursCovered < size) {
          let cannotFind = false;
          for (let shiftLength = size - hoursCovered; shiftLength > 0; shiftLength--) {
            // Look at each employee by minimum number of hours in this schedule so far
            // Check if they are available from index + hoursCovered to index+shiftLength
            // If so, increment hoursCovered by shiftLength and mark down the workerId, shift start, and duration
            let found = false;
            sortByHours();
            let shiftStart = moment(availabilityStart).add(index+hoursCovered, "hours");
            console.log(`Looking for shift of length ${shiftLength} from ${formatMoment(shiftStart)} towards ${formatMoment(segmentEnd)}`);
            
            for (let worker of hoursWorked) {
              if (isAvailable(worker.id, index+hoursCovered, shiftLength)) {
                // This is our worker!
                found = true;
                // Figure out what time they start working

                allShifts.push({ id: worker.id, start: formatMoment(shiftStart.tz("America/Toronto")),
                  dateString: dateString, duration: shiftLength});
                /*
                allShifts.push({ id: worker.id, start: formatMoment(shiftStart.tz("America/Toronto")),
                  dateString: dateString, hoursAfterAvail: index+hoursCovered, duration: shiftLength});
                  */

                worker.hours += shiftLength;
                hoursCovered += shiftLength;
                // If we're to support strength, then perhaps at this point we should
                // update the availability string of this worker so they do not get picked twice.
                // Then, we can just wrap this hoursCovered stuff in a loop from 0 to the strength number
                
              }
            }

            if (found == false && shiftLength == 1) {
              console.log("Unable to find workers for this shift")
              cannotFind = true;
              allShifts.push({ from: formatMoment(shiftStart), to: formatMoment(segmentEnd), status: "Unable to find" });
              //hoursCovered = size; // ???
              //break;
            }

            if (found)
              break;
            
          }
          if (hoursCovered >= size)
            break;
          if (cannotFind) {
            break;
          }
        }
         
      });
          
    } else {
      // Something is bad about the data
      
    }
  });
  
  // res.send(schedule);
  res.send(allShifts);
  // res.send(availability);
});

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
