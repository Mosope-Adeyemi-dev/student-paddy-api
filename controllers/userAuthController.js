const { userSignupValidation } = require("../services/validation");
const { createUser } = require("../services/userServices");
const { responseHandler } = require("../services/responseHandler");

const userSignup = async (req, res) => {
  const { details } = await userSignupValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const check = await createUser(req.body);
  console.log(check, "check is here");
  if (check[0]) {
    return responseHandler(res, "Signup succesful", 201, false, check[1]);
  }
  return responseHandler(res, "Signup failed", 400, true, check[1]);
};

module.exports = {
  userSignup,
};
