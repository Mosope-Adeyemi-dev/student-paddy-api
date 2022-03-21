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

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

const getEmailOrUsername = async (email) =>
  (await User.findOne({ email })) || (await User.findOne({ username }));

const signJwt = (id) => {
  const token = jwt.sign({ id }, process.env.SIGNED_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  return { token };
};

const validatePassword = async (formPassword, dbPassword) =>
  await bcrypt.compare(formPassword, dbPassword);

const verifyEmail = async (email) =>
  await User.findOneAndUpdate({ email }, { isVerfied: true }, { new: true });

const updatePassword = async (password, username) =>
  await User.findOneAndUpdate(
    { username },
    { password: await hashedPassword(password) },
    { new: true }
  );

const checkJwt = async (jwtID) => {
  try {
    return jwt.verify(jwtID, TOKEN_SECRET);
  } catch (error) {
    return { err: error.message };
  }
};

const getUserByID = async (id) => await User.findById(id);

const getUrl = async () =>
  process.env.MODE === "local"
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
  signJwt,
  getUrl,
};
