import React, { Component } from "react";
import moment from "moment";

import style from "./style.css";

export default class ShiftTimeDisplay extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {};
  }

  render() {
    let props = this.props;

    let firstMom = moment(props.shifts[0].start);
    // TODO: Send end over from server?
    let lastMom = moment(firstMom).add(props.shifts[0].duration, "hours");

    const workerInfo = {};
    props.shifts.forEach(shift => {
      const { dateString, id, start, duration } = shift;

      const startMom = moment(start);
      const endMom = moment(startMom).add(duration, "hours");

      if (workerInfo[id] == null) workerInfo[id] = [];

      workerInfo[id].push({ dateString, start: startMom, end: endMom });
    });

    const workerDisplay = Object.keys(workerInfo).map(workerId => {
      const shifts = workerInfo[workerId];
      // Sort by start time
      // Shifts had better not overlap.
      shifts.sort((shiftA, shiftB) => {
        if (shiftA.start.isBefore(shiftB.start)) return -1;
        else return 1;
      });

      const shiftsDisplay = shifts.map(shift => {
        return (
          <div className={style.shift}>
            {shift.start.format("llll")} to {shift.end.format("LT")}
          </div>
        );
      });

      const { start, end } = workerInfo[workerId];

      return (
        <div>
          <p>{workerId}</p>
          <div className={style.container}>{shiftsDisplay}</div>
        </div>
      );
    });

    return (
      <div>
        <span className={style.group}>
          <h3>Generated shifts</h3>
          <div onClick={this.props.cancel} className={style.button}>
            Go back
          </div>
        </span>
        <div key="workers" className={style.rows}>
          {workerDisplay}
        </div>
      </div>
    );
  }
}
