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

  Object.keys(strengthData).forEach(dateString => {
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
          for (let shiftLength = Math.min(8, size - hoursCovered); shiftLength > 0; shiftLength--) {
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

  });
  return { allShifts, hoursWorked, hoursUncovered, unable };

}

async function busyWorkers(strengthData, range, availability, workers) {

}
export default { greedy, busyWorkers }
