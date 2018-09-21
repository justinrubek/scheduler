import mongoose from "mongoose";
import moment from "moment";

import { dateValidator, timeValidator } from "../validators";

// TODO: Validation of Date and Time types
const ShiftSchema = new mongoose.Schema({
  date: { type: String, required: true, validate: dateValidator },
  startTime: { type: String, required: true, validate: { validator: timeValidator, message: props => `${props.value} is not a valid time` }},
  endTime: { type: String, required: true, validate: { validator: timeValidator, message: props => `${props.value} is not a valid time` }},
  scheduledWorker: { type: mongoose.Schema.Types.ObjectId }
}, {
  collection: "shifts"
});

function combineDateTime(date, time) {
  return moment(`${date} ${time}`, "YYYY-MM-DD HH:MM")
}

ShiftSchema.methods.startDateTime = () => {
  return combineDateTime(this.date, this.startTime);
};

ShiftSchema.methods.endDateTime = () => {
  return combineDateTime(this.date, this.endTime);
};

module.exports = mongoose.model("Shift", ShiftSchema);
