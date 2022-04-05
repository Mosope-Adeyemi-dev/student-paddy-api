const { createPostValidation } = require("../services/validation");
const { responseHandler } = require("../services/responseHandler");
const { uploadTextPosts } = require("../services/postServices.js");

const createPost = async (req, res) => {
  console.log(req.query.type);
  console.log(req.body);
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
  //   if (type === "file") {

  //   }
  console.log(type);
};

module.exports = {
  createPost,
};
