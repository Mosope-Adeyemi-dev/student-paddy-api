const mongoose = require("mongoose");
const { Schema } = mongoose;
const communityContributorsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    contributedPostId: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const communityContributors = mongoose.model(
  "communityContributors",
  communityContributorsSchema
);
module.exports = communityContributors;
