const Topic = require("../models/topicModel");
const Community = require("../models/communityModel");
const TopicFollowers = require("../models/topicFollows");
const { translateError } = require("../services/mongo_helper");

const setTopic = async ({ name, communityId }) => {
  try {
    let newTopic = Topic({
      name,
      communityId,
    });
    if (await newTopic.save()) {
      return [true, newTopic];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const setCommunity = async ({ name, description }) => {
  try {
    let newCommunity = Community({
      name,
      description,
    });
    if (await newCommunity.save()) {
      return [true, newCommunity];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const updateTopicFollowers = async ({ topicId, userId }) => {
  try {
    //check if topic already exists
    if (!(await checkTopic(topicId))) {
      return [false, "Topic with that ID does not exist"];
    }

    //check if user is already following topic
    const result = await isUserFollowingTopic(topicId, userId);
    console.log(result);
    if (result) {
      return [false, "User is already following topic"];
    }

    const newTopicFollower = TopicFollowers({
      topicId,
      userId,
    });

    if (await newTopicFollower.save()) {
      return [true, newTopicFollower];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const checkTopic = async (topicId) => await Topic.findById(topicId);

const isUserFollowingTopic = async (topicId, userId) =>
  await TopicFollowers.findOne({ topicId, userId });

module.exports = {
  setTopic,
  setCommunity,
  updateTopicFollowers,
  checkTopic,
  isUserFollowingTopic,
};
