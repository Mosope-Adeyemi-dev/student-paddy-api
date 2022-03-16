const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { translateError } = require("../services/mongo_helper");
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

//Hash plain password
const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

const signJwt = (id) => {
  const token = jwt.sign({ id }, process.env.SIGNED_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  return { token };
};

module.exports = {
  createUser,
};
