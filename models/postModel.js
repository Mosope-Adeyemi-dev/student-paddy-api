const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    topic: { type: String, required: true },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    postContent: { type: String, required: true },
    communityName: { type: String, required: true },
    postCreator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    downvotes: Number,
    upvotes: Number,
    parentPostId: { type: Schema.Types.ObjectId, ref: "Post" },
    numberOfReposts: Number,
    caption: String,
    title: String,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("posts", postSchema);
module.exports = Post;
