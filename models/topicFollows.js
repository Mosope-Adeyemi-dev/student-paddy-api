const mongoose = require("mongoose");
const { Schema } = mongoose;
const topicFollowsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic" },
  },
  { timestamps: true }
);

const TopicFollowers = mongoose.model("topicFollowers", topicFollowsSchema);
module.exports = TopicFollowers;
