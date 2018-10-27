import React from "react";
import axios from "axios";
import style from "./style.css";

import Form from "../Form";

export default class TimeSegment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Form input={TimeSegment.inputs} onChange={this.props.onChange} />{" "}
        <button onClick={this.props.onRemove}>X</button>
      </div>
    );
  }
}
TimeSegment.defaultProps = {};

TimeSegment.propTypes = {};

TimeSegment.inputs = [
  { type: "time", name: "startTime", label: "Start time" },
  { type: "time", name: "endTime", label: "End time" },
  { type: "number", name: "strength", label: "Worker count" }
];
