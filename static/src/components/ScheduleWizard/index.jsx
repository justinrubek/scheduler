import axios from "axios";
import React, { Component } from "react";
import shortid from "shortid";

import style from "./style.css";

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import TimeSegment from "./TimeSegment";
import SegmentCreator from "./SegmentCreator";

class SegmentSelector extends Component {
  constructor(props) {
    super(props);

    const dates = [];
    for (let i = 0; i < 3; i++) {
      const start = moment()
        .startOf("week")
        .add(1, "day")
        .add(i * 7, "days");

      const end = moment(start).add(4, "days");

      dates.push({ start, end });

      const weekendStart = moment(end).add(1, "day");
      const weekendEnd = moment(weekendStart).add(1, "day");
      dates.push({ start: weekendStart, end: weekendEnd });
    }

    this.state = { dates };
  }

  render() {
    const { dates } = this.state;

    const display = dates.map(date => {
      let click = () =>
        this.props.select(
          date.start.format("YYYY-MM-DD"),
          date.end.format("YYYY-MM-DD")
        );

      return (
        <div onClick={click}>
          {date.start.format("ddd MMMM Do YY")} to{" "}
          {date.end.format("ddd MMMM Do YY")}
        </div>
      );
    });

    return (
      <div>
        Select shift range to schedule for
        {display}
      </div>
    );
  }
}

export default class ScheduleWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { startDate, endDate } = this.state;

    if (startDate && endDate) {
      return (
        <SegmentCreator
          startDate={startDate}
          endDate={endDate}
          onSubmit={async data => {
            let response = await axios.post("/api/createSchedule", data);
            console.log(response);
          }}
          cancel={() => this.setState({ startDate: null, endDate: null })}
        />
      );
    } else {
      return (
        <SegmentSelector
          select={(startDate, endDate) => this.setState({ startDate, endDate })}
        />
      );
    }
  }
}

ScheduleWizard.defaultProps = {};

ScheduleWizard.propTypes = {};
