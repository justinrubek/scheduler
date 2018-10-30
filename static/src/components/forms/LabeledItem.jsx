import React from "react";
import moment from "moment";

import style from "./style.css";

export default class LabeledItem extends React.Component {
  render() {
    return (
      <span className={style.displayGroup}>
        <p className={style.label}>{this.props.label}</p>
        <span className={style.value}>{this.props.children}</span>
      </span>
    );
  }
}
