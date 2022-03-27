const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { translateError } = require("./mongo_helper");
const jwt = require("jsonwebtoken");

const createUser = async ({ username, country, email, password }) => {
  try {
    let newUser = User({
      username,
      country,
      email,
      password: await hashedPassword(password),
    });

    if (await newUser.save()) {
      return [true, signJwt(newUser._id), newUser];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const updateUserDetails = async (updateBody, id) => {
  console.log(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true }
    );
    if (updatedUser) {
      return [true, updatedUser];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};
const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

const getEmailOrUsername = async (emailOrUsername) =>
  (await User.findOne({ email: emailOrUsername })) ||
  (await User.findOne({ username: emailOrUsername }));

const signJwt = (id) => {
  const token = jwt.sign({ id }, process.env.SIGNED_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  return { token };
};

const validatePassword = async (formPassword, dbPassword) => {
  console.log(formPassword, dbPassword);
  try {
    const result = await bcrypt.compare(formPassword, dbPassword);
    if (result) {
      return [true, result];
    }
    return [false, result];
  } catch (error) {
    return [false, translateError(error)];
  }
};

const verifyEmail = async (email) =>
  await User.findOneAndUpdate({ email }, { isVerfied: true }, { new: true });

const updatePassword = async (password, email) =>
  await User.findOneAndUpdate(
    { email },
    { password: await hashedPassword(password) },
    { new: true }
  );

const checkJwt = async (jwtID) => {
  try {
    return jwt.verify(jwtID, process.env.SIGNED_SECRET);
  } catch (error) {
    return { err: error.message };
  }
};

const getUserByID = async (id) => {
  try {
    const foundUser = await User.findById(id).select(
      "_id username firstname lastname email skills country bio university academicStatus graduationYear department faculty"
    );
    if (foundUser) {
      return [true, foundUser];
    }
    return [false, "Unable to retrieve user details"];
  } catch (error) {
    return [false, translateError(error)];
  }
};

const scaledPicture = (pic) =>
  pic.replace("/upload", "/upload/c_scale,h_200,q_auto:best,w_200");

const updateUserImages = async (type, picture, id) =>
  type === "photo"
    ? await User.findByIdAndUpdate(id, { photo: picture }, { new: true })
    : await User.findByIdAndUpdate(id, { coverPhoto: picture }, { new: true });

const getUrl = () =>
  process.env.MODE == "local"
    ? "http://localhost:5000/"
    : "https://student-paddy-api.herokuapp.com/api/v1/";

module.exports = {
  createUser,
  validatePassword,
  getUserByID,
  checkJwt,
  updatePassword,
  verifyEmail,
  getEmailOrUsername,
  updateUserDetails,
  signJwt,
  getUrl,
  updateUserImages,
  scaledPicture,
};
