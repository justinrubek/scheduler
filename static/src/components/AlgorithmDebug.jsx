import React, { Component } from "react";
import axios from "axios";

const form_input = [
  { type: "date", name: "startDate", label: "Start date" },
  { type: "time", name: "startTime", label: "Start time" },
  { type: "date", name: "endDate", label: "End date" },
  { type: "time", name: "endTime", label: "End time" },
  { type: "number", name: "interval", label: "Time Interval(minutes)" }
];

import Form from "./Form";

export default class AlgorithmDebug extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const { link } = this.state;

    let linkDisplay;
    if (link) {
      linkDisplay = (
        <a target="_blank" href={link}>
          Click me
        </a>
      );
    }

    return (
      <div>
        <Form
          input={form_input}
          name="Schedule Interval Checker"
          onChange={data => {
            const { interval, startTime, endTime, startDate, endDate } = data;
            let dateTime = (date, time) => `${date}T${time}:00`;

            const url = `/api/office/calendar?i=${interval}&start=${dateTime(
              startDate,
              startTime
            )}&end=${dateTime(endDate, endTime)}`;
            this.setState({ link: url });
          }}
        />

        {linkDisplay}
      </div>
    );
  }
}
