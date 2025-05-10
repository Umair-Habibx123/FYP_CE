import mongoose from 'mongoose'; 
import { Schema } from "mongoose";


const userSchema = new Schema(
  {
    _id: { type: String, required: true, unique: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    role: { type: String, enum: ["student", "teacher", "industry", "admin"], default: "student" },
    status: { type: String, enum: ["verified", "pending", "banned"], default: "pending" },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;