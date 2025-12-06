import mongoose from "mongoose";

const OnboardingSchema = new mongoose.Schema({
  employeeId: String,
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  email: String,
  tasks: [
    {
      title: String,
      completed: { type: Boolean, default: false }
    }
  ],
  documents: [
    {
      name: String,
      file: String,
      status: { type: String, default: "pending" } // verified, rejected
    }
  ],
  status: { type: String, default: "initiated" }
});

export default mongoose.model("Onboarding", OnboardingSchema);
