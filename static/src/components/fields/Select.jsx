import React from "react";
import shortid from "shortid";

export default class SelectField extends React.Component {
  constructor(props) {
    super(props);

    this.select = this.select.bind(this);

    const options = this.props.options.map(option => {
      return {
        name: option
      };
    });

    const selected = null;

    this.state = {
      options,
      selected
    };
  }

  select(option) {
    if (option.name != this.state.selected) {
      this.setState({ selected: option.name });
      if (this.props.onChange != null) {
        this.props.onChange(option);
      }
    }
  }

  render() {
    const { options, selected } = this.state;

    const display = options.map(option => {
      const id = shortid.generate();
      return (
        <div key={option.name}>
          <input
            type="radio"
            checked={selected == option.name}
            onClick={() => this.select(option)}
            id={id}
          />
          <label className="form_label" htmlFor={id}>
            {option.name}
          </label>
        </div>
      );
    });

    return <div>{display}</div>;
  }
}
