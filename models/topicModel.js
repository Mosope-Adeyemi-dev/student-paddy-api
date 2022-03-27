const mongoose = require("mongoose");
const { Schema } = mongoose;
const topicSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    communityId: { type: Schema.Types.ObjectId, ref: "Community" },
  },
  { timestamps: true }
);

const Topic = mongoose.model("topic", topicSchema);
module.exports = Topic;
