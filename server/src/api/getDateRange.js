import moment from "moment";

export default function getDateRange(start, end) {
  const dates = [];

  let currentDate = moment(start);
  let stopDate = moment(end);

  if (currentDate > stopDate) {
    throw "Start date is before end date";
  }

  while (currentDate <= stopDate) {
    dates.push(moment(currentDate).format("YYYY-MM-DD"));
    currentDate = moment(currentDate).add(1, "days");
  }

  return dates;
}
