const {
  createCommunityValidation,
  followCommunityValidation,
} = require("../services/validation");
const {
  setCommunity,
  updateCommunityFollowers,
  getAllCommunities,
  communityDetails,
} = require("../services/communityServices");
const { responseHandler } = require("../services/responseHandler");
const CommunityFollowers = require("../models/communityFollowers");
const Topic = require("../models/topicModel");

const createCommunity = async (req, res) => {
  const { details } = await createCommunityValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  if (req.file == undefined) {
    return responseHandler(res, "Include community cover photo", 400, true, "");
  }
  const coverPhoto = req.file.path;
  req.body["coverPhoto"] = coverPhoto;
  const check = await setCommunity(req.body);
  if (check[0]) {
    return responseHandler(
      res,
      "Community set successfully",
      201,
      false,
      check[1]
    );
  }
  return responseHandler(res, check[1], 400, true, "");
};

const followCommunity = async (req, res) => {
  const { details } = await followCommunityValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const check = await updateCommunityFollowers(req.body);
  if (check[0]) {
    return responseHandler(
      res,
      "Community follower added successfully",
      200,
      false,
      check[1]
    );
  }
  return responseHandler(res, check[1], 400, true, "");
};

const getCommunities = async (req, res) => {
  const communities = await getAllCommunities();

  if (communities) {
    let facets = {};
    communities.forEach((community) => {
      facets[community.name] = [
        {
          $match: { communityId: community._id },
        },
        {
          $group: {
            _id: { id: community._id, name: community.name },
            followersCount: { $sum: 1 },
          },
        },
      ];
    });

    const matchingFollowers = await CommunityFollowers.aggregate([
      { $facet: facets },
    ]);
    const matchingTopics = await Topic.aggregate([{ $facet: facets }]);

    let completeDetails = [];
    communities.forEach((e) => {
      let communityStats = matchingFollowers[0][e.name][0];
      communityStats.topicCount = matchingTopics[0][e.name][0]
        ? matchingTopics[0][e.name][0]["followersCount"]
        : 0;
      completeDetails.push(communityStats);
    });
    return responseHandler(
      res,
      "Community details retrieved",
      200,
      false,
      completeDetails
    );
  }
  return responseHandler(res, "No communities found", 400, true, "");
};

const getCommunityDetails = async (req, res) => {
  if (!req.params.communityId) {
    return responseHandler(res, "Include community ID", 400, true, "");
  }
  const { communityId } = req.params;
  const check = await communityDetails(communityId);

  if (check[0]) {
    return responseHandler(
      res,
      "Community details succesfully retrieved",
      200,
      false,
      check[1]
    );
  }
  return responseHandler(
    res,
    "Community detail retrieval failed",
    400,
    true,
    ""
  );
};
module.exports = {
  createCommunity,
  followCommunity,
  getCommunities,
  getCommunityDetails,
};
