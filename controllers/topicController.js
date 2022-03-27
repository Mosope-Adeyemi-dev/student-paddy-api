const { responseHandler } = require("../services/responseHandler");
const { setTopic, updateTopicFollowers } = require("../services/topicServices");
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

module.exports = {
  createTopic,
  followTopic,
};
