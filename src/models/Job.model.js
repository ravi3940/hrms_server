import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  type: { type: String, default: "Full-Time" }, // Added
  location: String,
  description: String,
  requirements: String,
  salaryRange: String,
  status: { type: String, default: "open" }  // open, closed
}, { timestamps: true });

export default mongoose.model("Job", JobSchema);
