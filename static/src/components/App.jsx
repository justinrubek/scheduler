import React from "react";
import axios from "axios";
import moment from "moment";

import style from "./style.css";

import Form from "./Form";

import ScheduleWizard from "./ScheduleWizard";

import AlgorithmDebug from "./AlgorithmDebug";

function log(type, time) {
  console.log(`Sending: ${type} for time ${time}`);
  // Create log object
  const data = {
    type: type,
    time: time
  };
  // Post to server
  axios.post("/api/log", data);
}

const actions = [
  {
    name: "employee_creation_form",
    input: [
      { type: "text", name: "name", label: "Name" },
      { type: "text", name: "email", label: "Email" }
    ]
  }
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.componentWillMount = this.componentWillMount.bind(this);
    this.state = {};
  }

  async componentWillMount() {
    let resp = await axios.get("/api/office");

    console.log(resp.data);
    console.log("setting state to ", resp.data);
    this.setState(resp.data);
    /*
    console.log("After response");
    if (resp.url) {
      console.log("got URL");
      this.setState({ url: resp.url });
    } else {
      console.log("No url")
      this.setState({ authToken: resp.authToken });
    }
    */
  }

  render() {
    const { accessToken, url } = this.state;
    let scheduler;

    if (url && !accessToken) {
      window.location.href = url;
      scheduler = (
        <button onClick={() => (window.location.href = url)}>Log in</button>
      );
    } else if (accessToken) {
      scheduler = (
        <ScheduleWizard startDate="2018-10-27" endDate="2018-11-02" />
      );
    } else {
      scheduler = <p>loading</p>;
    }

    return (
      <div>
        <h1>Scheduler</h1>
        {scheduler}
      </div>
    );
  }
}
