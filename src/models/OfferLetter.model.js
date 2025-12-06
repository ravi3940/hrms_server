import mongoose from "mongoose";

const OfferLetterSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String },
  designation: { type: String, required: true },
  salary: String,
  joiningDate: String,
  logo: String,
  signature: String,
  pdfFile: String,
  emailSent: { type: Boolean, default: false },
  status: { type: String, enum: ["sent","accepted","declined"], default: "sent" }
}, { timestamps: true });

export default mongoose.model("OfferLetter", OfferLetterSchema);