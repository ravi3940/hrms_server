import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },

  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },

  interviewType: {
    type: String,
    enum: ["Technical", "HR Round", "Managerial"],
    required: true,
  },

  date: String,
  time: String,

  interviewer: String,

  status: {
    type: String,
    enum: [
      "Scheduled",
      "Pending",
      "Selected",
      "Next_Round",
      "Rejected",
      "Completed",
      "Cancelled"
    ],
    default: "Pending"
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Interview", InterviewSchema);
