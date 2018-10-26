import React from "react";
import axios from "axios";
import style from "./style.css";

import { DateSelectorForm, EmployeeForm, TimeForm, SelectForm } from "../forms";

let forms = require("../forms");
console.log(forms);

function getDefaultValueFromType(type) {
  return null;
}

/*
  Should try to divide this into a few separate components or change a few buttons
  and the default values based on props passed

  * InstanceForm
    * Gets data from db and allows editing of item before saving back to db
  * BlankForm
    * Essentially the current state. Allows for creation of the object

  ### IDEA 1
    Move getDefaultValueFromType to be an actionform method. Then,
    make it async and have it fetch from the db or be null
    depending on if this is an instance form or not
*/
export default class ActionForm extends React.Component {
  constructor(props) {
    super(props);

    this.get_form = this.get_form.bind(this);
    this.submit = this.submit.bind(this);

    const inputs = [];
    for (let input of props.input) {
      inputs.push(
        Object.assign(input, {
          value: getDefaultValueFromType(input.type)
        })
      );
    }

    this.state = {
      inputs,
      name: props.name
    };
  }

  submit(data) {
    console.log("Form submitted");
    const inputs = this.state.inputs;

    const input_data = {};
    for (let input of inputs) {
      input_data[input.name] = input.value;
    }
    console.log("Data to submit: ");
    console.log(input_data);

    if (this.props.onSubmit != null) {
      this.props.onSubmit(input_data);
    }
    console.log("called onSubmit");
    console.log(`submitType: ${this.props.submitType}`);

    if (this.props.submitType != null) {
      switch (this.props.submitType) {
        case "POST":
          console.log("Sending POST request");
          const result = axios.post(this.props.route, input_data);
          break;
        default:
          console.log(
            `Unknown submit type for ActionForm: ${this.props.submitType}`
          );
      }
    }
  }

  valueChange(name, new_val) {
    const inputs = this.state.inputs.slice();

    for (let input of inputs) {
      if (input.name == name) {
        input.value = new_val;
      }
    }

    this.setState({ inputs });
  }

  get_form(input) {
    const changed = val => this.valueChange(input.name, val);

    if (input.type != null) {
      console.log(input.type);
      switch (input.type) {
        case "text":
          return <input type="text" onChange={e => changed(e.target.value)} />;
          break;
        case "time":
          return <TimeForm info={input} onChange={changed} />;
          break;
        case "employee":
          return <EmployeeForm info={input} onChange={changed} />;
          break;
        case "select":
          return (
            <SelectForm
              info={input}
              options={input.options}
              onChange={changed}
            />
          );
          break;
        case "date":
          return <DateSelectorForm info={input} onChange={changed} />;
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
      let form = this.get_form(input);
      return (
        <div key={input.label}>
          <p>{input.label}</p>
          {form}
        </div>
      );
    });

    return (
      <div className={style.container}>
        <div className={style.title}>{name}</div>
        {input_display}
        <button onClick={this.submit} className={style.submit}>
          Submit
        </button>
      </div>
    );
  }
}
