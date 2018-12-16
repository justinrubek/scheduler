const graph = require("@microsoft/microsoft-graph-client");

function getClient(accessToken) {
  return graph.Client.init({
    authProvider: done => {
      done(null, accessToken);
    }
  });
}

/* TODO: Refine the output of this function. */
async function getStaIds(accessToken) {
  const STA_GROUP_ID = "1784af82-4e82-42bc-a695-91e3107952b8";
  
  const client = getClient(accessToken);

  const result = await client
    .api(`/groups/$STA_GROUP_ID}/members`)
    .get();

  return result;
}

// Given a list of worker emails and a datetime range, grab all of their schedules
async function getSchedule(accessToken, workers, start, end) {
  const client = getClient(accessToken);
   const result = await client.api("/me/calendar/getschedule")
    .version("beta")
    .post({
      Schedule: workers,
      StartTime: { dateTime: start, timeZone: "CST" },
      EndTime: { dateTime: end, timeZone: "CST" },
      availabilityViewInterval: "15" // TODO: Use this to try to simplify the overall algorithm
      }); 
  return result;
}

