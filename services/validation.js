const Joi = require("joi");

//User registration validation rules
const userSignupValidation = async (field) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    password: Joi.string().required().min(8).max(1024),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//User set profile validation rules
const userSetProfileValidation = async (field) => {
  const schema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    username: Joi.string().alphanum(),
    password: Joi.string().min(8).max(1024),
    academicStatus: Joi.string(),
    university: Joi.string(),
    skills: Joi.array(),
    faculty: Joi.string(),
    department: Joi.string(),
    graduationYear: Joi.string(),
    bio: Joi.string(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//User login validation rules
const userLoginValidation = async (field) => {
  const schema = Joi.object({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required().min(8).max(1024),
  });

  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const verifyEmailVerification = async (field) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//User forgot password validation rules
const userforgotPasswordValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//User reset password validation rules
const userResetPasswordValidation = async (field) => {
  const schema = Joi.object({
    password: Joi.string().required().min(8).max(1024),
    confirmPassword: Joi.string().required().min(8).max(1024),
    id: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//Create topic (temp)
const createTopicValidation = async (field) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    communityId: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//Create post (temp)
const createPostValidation = async (field) => {
  const schema = Joi.object({
    topicId: Joi.string().required().alphanum(),
    topic: Joi.string().required(),
    postContent: Joi.required().allow(""),
    caption: Joi.string(),
    communityId: Joi.string().required().alphanum(),
    communityName: Joi.string().required(),
    postCreator: Joi.string().required().alphanum(),
    parentPostId: Joi.string(),
    title: Joi.string(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//Follow topic
const followTopicValidation = async (field) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    topicId: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const createCommunityValidation = async (field) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const followCommunityValidation = async (field) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    communityId: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  userSignupValidation,
  userLoginValidation,
  userforgotPasswordValidation,
  userResetPasswordValidation,
  userSetProfileValidation,
  verifyEmailVerification,
  createTopicValidation,
  followTopicValidation,
  createCommunityValidation,
  followCommunityValidation,
  createPostValidation,
};
