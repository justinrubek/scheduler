import React from "react";
import axios from "axios";
import style from "./style.css";

import Form from "../Form";
import TimeField from "../fields/Time";

import LabeledItem from "../format/LabeledItem";

export default class TimeSegment extends React.Component {
  constructor(props) {
    super(props);

    this.change = this.change.bind(this);
    this.changeValue = this.changeValue.bind(this);

    this.state = {
      startTime: props.startTime,
      endTime: props.endTime,
      strength: props.strength
    };
  }

  change(new_vals) {
    this.props.onChange(new_vals);
  }

  changeValue(name, new_val) {
    // Validation
    if (name === "strength") {
      if (new_val < 1) return;
    }
    const { startTime, endTime, strength } = this.props;

    const new_vals = { startTime, endTime, strength };

    new_vals[name] = new_val;

    this.change(new_vals);
    this.setState(new_vals);
  }

  render() {
    const { startTime, endTime, strength } = this.props;

    return (
      <div className={style.box}>
        <div className={style.separated}>
          <p className={style.smalltitle}>{this.props.title}</p>
          <div
            className={`${style.button} ${style.vcenter}`}
            onClick={this.props.onRemove}
          >
            x
          </div>
        </div>
        <LabeledItem label="Start">
          <TimeField
            onChange={time => {
              this.changeValue("startTime", time);
            }}
            value={startTime}
          />
        </LabeledItem>
        <LabeledItem label="End">
          <TimeField
            onChange={time => {
              this.changeValue("endTime", time);
            }}
            value={endTime}
          />
        </LabeledItem>
        <LabeledItem label="Workers">
          <input
            key="count"
            type="number"
            onChange={e => {
              this.changeValue("strength", e.target.value);
            }}
            value={strength}
          />
        </LabeledItem>
      </div>
    );
  }
}
TimeSegment.defaultProps = {};

TimeSegment.propTypes = {};
