import axios from "axios";
import React, { Component } from "react";
import shortid from "shortid";

import style from "./style.css";

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import TimeSegment from "./TimeSegment";
import SegmentCreator from "./SegmentCreator";
import ShiftTimeDisplay from "./ShiftTimeDisplay";

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

    this.state = { dates, otherDates: { start: moment(), end: moment() } };
  }

  render() {
    const { dates, otherDates } = this.state;

    const display = dates.map(date => {
      let click = () =>
        this.props.select(
          date.start.format("YYYY-MM-DD"),
          date.end.format("YYYY-MM-DD")
        );
      let label = `${date.start.format("ddd MMMM Do YY")} to ${date.end.format(
        "ddd MMMM Do YY"
      )}`;

      return (
        <div className={style.button} onClick={click}>
          {label}
        </div>
      );
    });

    const others = (
      <div className={`${style.vcenter} ${style.container}`}>
        <input
          type="date"
          id="otherStart"
          onChange={e =>
            this.setState({
              otherDates: {
                ...otherDates,
                start: moment(e.target.value, "YYYY-MM-DD")
              }
            })
          }
        />
        {" to "}
        <input
          type="date"
          id="otherEnd"
          onChange={e =>
            this.setState({
              otherDates: {
                ...otherDates,
                end: moment(e.target.value, "YYYY-MM-DD")
              }
            })
          }
        />
        <div
          onClick={() => this.props.select(otherDates.start, otherDates.end)}
          className={style.button}
        >
          Select
        </div>
      </div>
    );

    return (
      <div className={style.box}>
        <h2>When would you like to schedule for?</h2>
        <span>
          <h3>Normal work weeks</h3>
          {display}
        </span>
        <span>
          <h3>Pick between dates</h3>
          {others}
        </span>
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
    const { shifts, startDate, endDate } = this.state;

    if (shifts) {
      return (
        <ShiftTimeDisplay
          shifts={shifts}
          cancel={() => this.setState({ shifts: null })}
        />
      );
    } else if (startDate && endDate) {
      return (
        <SegmentCreator
          startDate={startDate}
          endDate={endDate}
          onSubmit={async data => {
            let response = await axios.post(
              "/api/schedule/createSchedule",
              data
            );
            console.log(response);
            this.setState({ shifts: response.data.allShifts });
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
