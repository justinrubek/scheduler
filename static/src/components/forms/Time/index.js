import React from "react";
import moment from "moment";

import TimeSelector from "../../fields/Time";
import FormStyle from "../../forms/Form";

import style from "../style.css";

export default class TimeForm extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {};
  }

  onChange(time) {
    if (this.props.onChange != null) {
      this.props.onChange(time);
    }
  }

  render() {
    return (
      <span className={style.displayGroup}>
        <p className={style.label}>{this.props.label}</p>
        <TimeSelector
          className={style.value}
          onChange={this.onChange}
          value={this.props.value}
        />
      </span>
    );
  }
}
