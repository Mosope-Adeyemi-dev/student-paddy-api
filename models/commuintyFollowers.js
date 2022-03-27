const mongoose = require("mongoose");
const { Schema } = mongoose;
const communityFollowersSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
  },
  { timestamps: true }
);

const CommunityFollowers = mongoose.model(
  "community",
  communityFollowersSchema
);
module.exports = CommunityFollowers;
