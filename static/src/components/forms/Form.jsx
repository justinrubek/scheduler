import React from "react";
import style from "./style.css";

// Do we even want this? It might be useful
export default class Form extends React.Component {
  render() {
    return <div className={style.wrapper}>{this.props.children}</div>;
  }
}
