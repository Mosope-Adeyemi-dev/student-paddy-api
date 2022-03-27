const mongoose = require("mongoose");
const { Schema } = mongoose;
const communitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
  { timestamps: true }
);

const Community = mongoose.model("topic", communitySchema);
module.exports = Community;
