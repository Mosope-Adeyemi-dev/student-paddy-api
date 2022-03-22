const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, min: 8, max: 1024 },
    country: { type: String, required: true, trim: true },
    isVerfied: { type: Boolean, default: false },
    privacySetting: Object,
    bio: String,
    photo: String,
    coverPhoto: String,
    skills: Array,
    messagePermission: Boolean,
    university: String,
    department: String,
    academicStatus: {
      type: String,
      enum: ["Undergraduate", "Graduate", "Post-graduate"],
    },
    graduationYear: String,
  },
  { timestamps: true }
);
const User = mongoose.model("user", userSchema);
module.exports = User;
