import axios from "axios";
import React, { Component } from "react";
import shortid from "shortid";

import style from "./style.css";

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import TimeSegment from "./TimeSegment";

export default class ScheduleWizard extends Component {
  constructor(props) {
    super(props);

    this.createSegment = this.createSegment.bind(this);
    this.segmentChange = this.segmentChange.bind(this);

    const { startDate, endDate } = this.props;

    const dates = [];
    if (startDate < endDate) {
      const start = moment(startDate, "YYYY-MM-DD");
      const end = moment(endDate, "YYYY-MM-DD");
      const range = moment.range(start, end);

      for (let day of range.by("day")) {
        let dateString = day.format("YYYY-MM-DD");

        dates.push({ dateString, segments: [], moment: day });
      }
    } else {
      throw new Error("startDate for ScheduleWizard is after endDate");
    }

    this.state = { dates };
  }

  // Called when the user clicks the create shift button
  submit() {}

  createSegment(dateString) {
    const { dates } = this.state;

    const new_dates = dates.map(date => {
      if (date.dateString === dateString) {
        date.segments.push({
          id: shortid.generate(),
          startTime: null,
          endTime: null,
          count: 0
        });
      }
      return { ...date };
    });

    this.setState({ dates: new_dates });
  }

  removeSegment(dateString, id) {
    const { dates } = this.state;
    console.log(`Removing segment with id ${id} from ${dateString}`);

    const new_dates = dates.map(date => {
      if (date.dateString === dateString) {
        console.log(`Found date with matching dateString`);
        console.log(date.segments);
        const new_segments = date.segments.filter(
          (segment, i) => segment.id != id
        );

        console.log(new_segments);
        return { ...date, segments: new_segments };
      } else {
        console.log(`Keeping ${date}`);
        return date;
      }
    });

    this.setState({ dates: new_dates });
  }

  segmentChange(dateString, id, val) {
    const { dates } = this.state;

    const new_dates = dates.map(date => {
      if (date.dateString === dateString) {
        // Copy the array and change the value at that index
        const new_segments = date.segments.map(segment => {
          if (segment.id === id) {
            return val;
          } else {
            return segment;
          }
        });

        return { ...date, segments: new_segments };
      } else {
        return date;
      }
    });

    this.setState({ dates: new_dates });
  }

  render() {
    const { dates } = this.state;

    const days = dates.map(date => {
      const segments = date.segments.map((segment, i) => {
        const change = new_val =>
          this.segmentChange(date.dateString, i, new_val);

        const remove = () => this.removeSegment(date.dateString, segment.id);

        return (
          <TimeSegment key={segment.id} onChange={change} onRemove={remove} />
        );
      });

      return (
        <div className={style.segment_container} key={date.day}>
          <h2> {date.moment.format("MMM Do YY")} </h2>
          <button
            onClick={() => {
              this.createSegment(date.dateString);
            }}
          >
            +
          </button>
          <div className={style.segment_display}>{segments}</div>
        </div>
      );
    });

    return (
      <div>
        <div className={style.title}>Schedule shifts for week</div>
        <button onClick={this.submit} className={style.submit}>
          Submit
        </button>
        <div className={style.container}>{days}</div>
      </div>
    );
  }
}

ScheduleWizard.defaultProps = {};

ScheduleWizard.propTypes = {};
