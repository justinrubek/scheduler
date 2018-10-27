import React from "react";
import axios from "axios";
import moment from "moment";

import style from "./style.css";

import Form from "./Form";

import ScheduleWizard from "./ScheduleWizard";

function log(type, time) {
  console.log(`Sending: ${type} for time ${time}`);
  // Create log object
  const data = {
    type: type,
    time: time
  };
  // Post to server
  axios.post("/api/log", data);
}

const actions = [
  {
    name: "shift_creation_form",
    input: [
      { type: "date", name: "date", label: "Shift date" },
      { type: "time", name: "startTime", label: "Starting time" },
      { type: "time", name: "endTime", label: "Ending time" },
      { type: "employee", name: "scheduledWorker", label: "Scheduled employee" }
    ]
  },
  {
    name: "employee_creation_form",
    input: [{ type: "text", name: "name", label: "Name" }],
    submit: data => axios.post("/api/employees", data)
  }
];

// Should not have a function for this, can be handled due to type and route from action form definition
function create_shift(shiftData) {
  axios.post("/api/shifts", shiftData);
}
/*
function create_shift(date, startTime, endTime, scheduledWorker = null) {
  console.log(
    `Creating shift for employee ${scheduledWorker} on date: ${date.toISOString()} from ${startTime} to ${endTime}`
  );
}
 */
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.createShift = this.createShift.bind(this);

    this.state = {};
  }

  createShift(data) {
    const { date, startTime, endTime, scheduledWorker } = data;

    create_shift(date, startTime, endTime, scheduledWorker);
  }

  render() {
    const forms = [];
    for (let action of actions) {
      forms.push(
        <div className={style.box} key={action.name}>
          <Form
            input={action.input}
            name={action.name}
            onChange={console.log}
          />
        </div>
      );
    }

    return (
      <div>
        <h1>Scheduler</h1>
        <ScheduleWizard startDate="2018-10-27" endDate="2018-11-05" />
        {forms}
      </div>
    );
  }
}
