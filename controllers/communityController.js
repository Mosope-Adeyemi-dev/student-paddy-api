const {
  createCommunityValidation,
  followCommunityValidation,
} = require("../services/validation");
const {
  setCommunity,
  updateCommunityFollowers,
} = require("../services/communityServices");
const { responseHandler } = require("../services/responseHandler");

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
      "Topic follower added successfully",
      200,
      false,
      check[1]
    );
  }
  return responseHandler(res, check[1], 400, true, "");
};

module.exports = {
  createCommunity,
  followCommunity,
};
