import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: false
  },

  role: {
    type: String,
    enum: ["admin", "hr", "manager", "user"],
    default: "user"
  }
});

export default mongoose.model("User", UserSchema);
