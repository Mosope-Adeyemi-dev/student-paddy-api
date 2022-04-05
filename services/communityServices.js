const Community = require("../models/communityModel");
const CommunityFollowers = require("../models/communityFollowers");
const { translateError } = require("../services/mongo_helper");
const { default: mongoose } = require("mongoose");

const setCommunity = async ({ name, description, coverPhoto }) => {
  try {
    const newCommunity = Community({
      name,
      description,
      coverPhoto,
    });
    if (await newCommunity.save()) {
      return [true, newCommunity];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const updateCommunityFollowers = async ({ communityId, userId }) => {
  try {
    //check if topic already exists
    if (!(await checkCommunity(communityId))) {
      return [false, "Community with that ID does not exist"];
    }

    //check if user is already following topic
    const result = await isUserFollowingCommunity(communityId, userId);
    console.log(result);
    if (result) {
      return [false, "User is already following topic"];
    }

    const newCommunityFollower = CommunityFollowers({
      communityId,
      userId,
    });

    if (await newCommunityFollower.save()) {
      return [true, newCommunityFollower];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const communityDetails = async (id) => {
  try {
    const community = await checkCommunity(id);

    const communityFollowers = await getCommunityUsersDetail(id);
    let details = {
      community,
      followers: communityFollowers,
    };

    if (community) {
      return [true, details];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};
const getCommunityUsersDetail = async (id) => {
  const communityId = mongoose.Types.ObjectId(id);

  const result = await CommunityFollowers.aggregate([
    {
      $match: { communityId: communityId },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$userData._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$userId"] },
            },
          },
          {
            $project: {
              _id: 0,
              password: 0,
              createdAt: 0,
              updatedAt: 0,
              __v: 0,
            },
          },
        ],
        as: "userData",
      },
    },
  ]);
  console.log(result);
  return result;
};
const checkCommunity = async (communityId) =>
  await Community.findById(communityId);

const isUserFollowingCommunity = async (communityId, userId) =>
  await CommunityFollowers.findOne({ communityId, userId });

const getAllCommunities = async () => await Community.find();

module.exports = {
  setCommunity,
  updateCommunityFollowers,
  checkCommunity,
  isUserFollowingCommunity,
  getAllCommunities,
  communityDetails,
};
