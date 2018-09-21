import React from "react";

import SelectField from "../fields/Select";
import FormStyle from "./Form";

export default class SelectForm extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {};
  }

  // TODO: Implementation
  onChange(option) {
    if (this.props.onChange != null) {
      this.props.onChange(option.name);
    }
  }

  render() {
    return (
      <FormStyle>
        <SelectField onChange={this.onChange} options={this.props.options} />
      </FormStyle>
    );
  }
}
