import mongoose from "mongoose";
import moment from "moment";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, {
  collection: "employees"
})


module.exports = mongoose.model("Employee", EmployeeSchema);
