const Community = require("../models/communityModel");
const CommunityFollowers = require("../models/topicFollows");
const { translateError } = require("../services/mongo_helper");

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

const checkCommunity = async (communityId) =>
  await Community.findById(communityId);

const isUserFollowingCommunity = async (communityId, userId) =>
  await CommunityFollowers.findOne({ communityId, userId });

module.exports = {
  setCommunity,
  updateCommunityFollowers,
  checkCommunity,
  isUserFollowingCommunity,
};
