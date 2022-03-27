const mongoose = require("mongoose");
const { Schema } = mongoose;
const communitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    coverPhoto: { type: String },
  },
  { timestamps: true }
);

const Community = mongoose.model("community", communitySchema);
module.exports = Community;
