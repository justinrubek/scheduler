import React from "react";
import axios from "axios";
import style from "./style.css";

import { DateField, TimeField, SelectField } from "../fields";
import LabeledItem from "../format/LabeledItem";

function getDefaultValueFromType(type) {
  switch (type) {
    case "number":
      return 0;
    case "text":
      return "";
    default:
      return null;
  }
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.buildOutput = this.buildOutput.bind(this);
    this.getForm = this.getForm.bind(this);
    this.submit = this.submit.bind(this);
    this.valueChange = this.valueChange.bind(this);

    const inputs = props.input.map(input => {
      return { ...input, value: getDefaultValueFromType(input.type) };
    });

    this.state = {
      inputs,
      name: props.name
    };
  }

  buildOutput(input_data) {
    const data = {};

    input_data.forEach(input => {
      data[input.name] = input.value;
    });

    return data;
  }

  submit(input_data) {
    const data = this.buildOutput(input_data);

    if (this.props.onChange != null) {
      this.props.onChange(data);
    }
  }

  valueChange(name, new_val) {
    const new_inputs = this.state.inputs.map(input => {
      if (input.name === name) return { ...input, value: new_val };
      else return input;
    });

    this.setState({ inputs: new_inputs });
    this.submit(new_inputs);
  }

  getForm(input) {
    const changed = val => this.valueChange(input.name, val);

    if (input.type != null) {
      switch (input.type) {
        case "number":
          return (
            <input type="number" onChange={e => changed(e.target.value)} />
          );
        case "text":
          return <input type="text" onChange={e => changed(e.target.value)} />;
          break;
        case "time":
          return <TimeField info={input} onChange={changed} />;
          break;
        case "select":
          return (
            <SelectField
              info={input}
              options={input.options}
              onChange={changed}
            />
          );
          break;
        case "date":
          return <DateField info={input} onChange={changed} />;
          break;
        default:
          return <div>Unimplemented type ({input.type})</div>;
      }
    } else {
      return <div>Undefined/null type in action entry</div>;
    }
  }

  render() {
    const { inputs, name } = this.state;

    const input_display = inputs.map(input => {
      let form = this.getForm(input);
      return (
        <LabeledItem key={input.label} label={input.label}>
          {form}
        </LabeledItem>
      );
    });

    return (
      <div className={style.container}>
        <div className={style.title}>{name}</div>
        {input_display}
      </div>
    );
  }
}
