const { createPostValidation } = require("../services/validation");
const { responseHandler } = require("../services/responseHandler");
const {
  uploadPosts,
  getPostByUserId,
  getPostByCommunityId,
} = require("../services/postServices.js");

const createPost = async (req, res) => {
  const { details } = await createPostValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  if (req.query.type == undefined)
    return responseHandler(
      res,
      "Include a valid post type in query",
      400,
      true,
      ""
    );
  const { type } = req.query;
  if (type == "link" || type == "question" || type == "post") {
    const check = await uploadTextPosts(type, req.body);
    if (check[0]) {
      return responseHandler(
        res,
        `${type} successfully created`,
        201,
        false,
        check[1]
      );
    }
    return responseHandler(res, check[1], 400, true, "");
  }
  if (type === "file") {
    const file = req.file.path;
    req.body.postContent = file;
    const check = await uploadPosts(type, req.body);
    if (check[0]) {
      return responseHandler(
        res,
        `${type} post successfully created`,
        201,
        false,
        check[1]
      );
    }
    return responseHandler(res, check[1], 400, true, "");
  }
};

const getUserPosts = async (req, res) => {
  if (req.params.userId == undefined)
    return responseHandler(res, "Include a valid user ID", 400, true, "");

  if (req.query.type == undefined)
    return responseHandler(res, "Include a valid type of post", 400, true, "");

  const check = await getPostByUserId(req.params.userId, req.query.type);

  if (check[0])
    return responseHandler(res, "User posts retrieved", 200, false, check[1]);

  return responseHandler(res, check[1], 400, true, "");
};

const getCommunityPosts = async (req, res) => {
  if (req.params.communityId == undefined)
    return responseHandler(res, "Include a valid community ID", 400, true, "");

  if (req.query.type == undefined)
    return responseHandler(res, "Include a valid type of post", 400, true, "");

  const check = await getPostByCommunityId(
    req.params.communityId,
    req.query.type
  );

  if (check[0])
    return responseHandler(
      res,
      "Community posts retrieved",
      200,
      false,
      check[1]
    );

  return responseHandler(res, check[1], 400, true, "");
};

module.exports = {
  createPost,
  getUserPosts,
  getCommunityPosts,
};
