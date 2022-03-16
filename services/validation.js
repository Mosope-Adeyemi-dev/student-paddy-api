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
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().alphanum().required(),
    password: Joi.string().required().min(8).max(1024),
    academicStatus: Joi.string().required(),
    university: Joi.string().required(),
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
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(1024),
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
    id: Joi.string().required().min(64),
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
};
