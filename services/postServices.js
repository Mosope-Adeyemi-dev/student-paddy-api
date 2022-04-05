const Post = require("../models/postModel");
const { translateError } = require("./mongo_helper");

const uploadTextPosts = async (type, requestBody) => {
  console.log(requestBody);
  try {
    requestBody.type = type;
    const newPost = new Post(requestBody);
    if (await newPost.save()) {
      return [true, newPost];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

module.exports = {
  uploadTextPosts,
};
