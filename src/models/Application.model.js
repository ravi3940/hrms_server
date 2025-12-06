


import mongoose  from "mongoose";
const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job",
    required: true 
  },

  candidateName: { type: String },  // ⭐ ADD
  email: { type: String },          // ⭐ ADD
  phone: { type: String },          // ⭐ ADD

  resume: String,

  status: {
    type: String,
    enum: ["applied", "shortlisted", "interview", "offered", "rejected"],
    default: "applied"
  },

  interviewFeedback: String,

  createdAt: { type: Date, default: Date.now }
});


const  Application  =  new  mongoose.model("Application", ApplicationSchema)

export  default  Application