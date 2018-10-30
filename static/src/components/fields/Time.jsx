import React from "react";

// This is a local time selector
export default class TimeSelector extends React.Component {
  render() {
    return (
      <input
        type="time"
        value={this.props.value}
        onChange={e => {
          const new_time = e.target.value.split(":");
          const hours = new_time[0];
          const minutes = new_time[1];

          this.props.onChange(`${hours}:${minutes}`);
        }}
      />
    );
  }
}
