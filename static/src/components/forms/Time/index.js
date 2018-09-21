import React from "react";
import moment from "moment";

import TimeSelector from "../../fields/Time";
import FormStyle from "../../forms/Form";

export default class TimeForm extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {};
  }

  onChange(hours, minutes) {
    if (this.props.onChange != null) {
      this.props.onChange(`${hours}:${minutes}`);
    }
  }

  render() {
    return (
      <FormStyle>
        <TimeSelector onChange={this.onChange} />
      </FormStyle>
    );
  }
}
