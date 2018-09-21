import React from "react";

import FormStyle from "./Form";

export default class EmployeeForm extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {};
  }

  onChange(option) {}

  render() {
    return (
      <FormStyle>
        <p>
          Hi, I am an Albanian employee form but because of poor technology in
          my country unfortunately I am not able to read the employee api.
          Please be so kind to host a webserver returning employee data and edit
          the js of this page to load from it
        </p>
      </FormStyle>
    );
  }
}
