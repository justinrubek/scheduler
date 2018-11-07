import axios from "axios";
import React, { Component } from "react";
import shortid from "shortid";

import style from "./style.css";

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import TimeSegment from "./TimeSegment";

export default class SegmentCreator extends Component {
  constructor(props) {
    super(props);

    this.createSegment = this.createSegment.bind(this);
    this.segmentChange = this.segmentChange.bind(this);
    this.submit = this.submit.bind(this);

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
  submit() {
    const { dates } = this.state;

    let data = dates.reduce((acc, day) => {
      acc[day.dateString] = day.segments.map(segment => ({
        start: segment.startTime,
        end: segment.endTime,
        strength: segment.strength
      }));
      return acc;
    }, {});

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  }

  createSegment(dateString) {
    const { dates } = this.state;

    const new_dates = dates.map(date => {
      if (date.dateString === dateString) {
        date.segments.push({
          id: shortid.generate(),
          startTime: "07:00",
          endTime: "17:00",
          strength: 1
        });
      }
      return { ...date };
    });

    this.setState({ dates: new_dates });
  }

  removeSegment(dateString, id) {
    const { dates } = this.state;

    const new_dates = dates.map(date => {
      if (date.dateString === dateString) {
        const new_segments = date.segments.filter(
          (segment, i) => segment.id != id
        );

        return { ...date, segments: new_segments };
      } else {
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
            // Ensure we copy the ID from segment into val using spread operator
            return { ...segment, ...val };
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
          this.segmentChange(date.dateString, segment.id, new_val);

        const remove = () => this.removeSegment(date.dateString, segment.id);

        return (
          <TimeSegment
            key={segment.id}
            onChange={change}
            onRemove={remove}
            startTime={segment.startTime}
            endTime={segment.endTime}
            strength={segment.strength}
            title={`time period ${i + 1}`}
          />
        );
      });

      return (
        <div className={style.segment_container} key={date.dateString}>
          <div key="info" className={style.separated}>
            <h2> {date.moment.format("MMM Do YY")} </h2>
            <button
              onClick={() => {
                this.createSegment(date.dateString);
              }}
            >
              +
            </button>
          </div>
          <div key="form" className={style.segment_display}>
            {segments}
          </div>
        </div>
      );
    });

    return (
      <div className={style.box}>
        <div key="top" className={style.separated}>
          <div onClick={this.props.cancel} className={style.title}>
            Schedule shifts for ({this.props.startDate} to {this.props.endDate})
          </div>
          <button onClick={this.submit} className={style.submit}>
            Generate shifts
          </button>
        </div>
        <div key="days" className={style.container}>
          {days}
        </div>
      </div>
    );
  }
}
