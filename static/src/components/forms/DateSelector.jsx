import React from "react";

import DateSelector from "../fields/DateSelector";
import FormStyle from "./Form";

export default class DateSelectorForm extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {};
  }

  // TODO: Implementation
  onChange(value) {
    if (this.props.onChange != null) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <FormStyle>
        <DateSelector onChange={this.onChange} />
      </FormStyle>
    );
  }
}
