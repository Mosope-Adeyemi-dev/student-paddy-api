const Post = require("../models/postModel");
const mongoose = require("mongoose");
const { translateError } = require("./mongo_helper");

const uploadPosts = async (type, requestBody) => {
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

const getPostByUserId = async (id, type) => {
  try {
    // const result = await Post.find({ postCreator: id, type });
    const result = await Post.aggregate([
      {
        $match: { postCreator: mongoose.Types.ObjectId(id), type },
      },
      {
        $lookup: {
          from: "users",
          localField: "postCreator",
          foreignField: "_id",
          as: "postCreatorDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$postCreatorDetails._id" },
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
                updatedAt: 0,
                __v: 0,
                skills: 0,
                isVerfied: 0,
                country: 0,
                academicStatus: 0,
                graduationYear: 0,
                department: 0,
                email: 0,
                createdAt: 0,
                deletedAccount: 0,
              },
            },
          ],
          as: "postCreatorDetails",
        },
      },
    ]);
    return [true, result];
  } catch (error) {
    return [false, translateError(error)];
  }
};

const getPostByCommunityId = async (id, type) => {
  try {
    // const result = await Post.find({ communityId: id, type });
    const result = await Post.aggregate([
      {
        $match: { communityId: mongoose.Types.ObjectId(id), type },
      },
      {
        $lookup: {
          from: "users",
          localField: "postCreator",
          foreignField: "_id",
          as: "postCreatorDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$postCreatorDetails._id" },
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
                updatedAt: 0,
                __v: 0,
                skills: 0,
                isVerfied: 0,
                country: 0,
                academicStatus: 0,
                graduationYear: 0,
                department: 0,
                email: 0,
                createdAt: 0,
                deletedAccount: 0,
              },
            },
          ],
          as: "postCreatorDetails",
        },
      },
    ]);
    return [true, result];
  } catch (error) {
    return [false, translateError(error)];
  }
};

module.exports = {
  uploadPosts,
  getPostByUserId,
  getPostByCommunityId,
};
