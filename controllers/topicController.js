const { responseHandler } = require("../services/responseHandler");
const {
  setTopic,
  updateTopicFollowers,
  searchTopic,
  getTopicsByCommunityId,
} = require("../services/topicServices");
const {
  createTopicValidation,
  followTopicValidation,
} = require("../services/validation");

const createTopic = async (req, res) => {
  const { details } = await createTopicValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const check = await setTopic(req.body);
  if (check[0]) {
    return responseHandler(res, "Topic set successfully", 201, false, check[1]);
  }
  return responseHandler(res, check[1], 400, true, "");
};

const followTopic = async (req, res) => {
  const { details } = await followTopicValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const check = await updateTopicFollowers(req.body);
  if (check[0]) {
    return responseHandler(
      res,
      "Topic follower added successfully",
      200,
      false,
      check[1]
    );
  }
  return responseHandler(res, check[1], 400, true, "");
};

const findTopic = async (req, res) => {
  if (req.query.key == undefined)
    return responseHandler(
      res,
      "Include a valid post type in query",
      400,
      true,
      ""
    );
  const { key } = req.query;
  console.log(key);
  const foundTopics = await searchTopic(key);
  console.log(foundTopics, "topics");
  if (foundTopics)
    return responseHandler(
      res,
      "Topics retrieved succesful",
      200,
      false,
      foundTopics
    );
  return responseHandler(res, "No topics matched", 400, true, "");
};

const getCommunityTopics = async (req, res) => {
  if (req.params.communityId == undefined)
    return responseHandler(res, "Include a valid community ID", 400, true, "");
  const check = await getTopicsByCommunityId(req.params.communityId);
  console.log(check[1]);
  if (check[0])
    return responseHandler(
      res,
      "Community topics retrieved",
      200,
      false,
      check[1]
    );

  return responseHandler(res, check[1], 400, true, "");
};

module.exports = {
  createTopic,
  followTopic,
  findTopic,
  getCommunityTopics,
};
