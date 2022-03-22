const {
  userSignupValidation,
  userLoginValidation,
  verifyEmailVerification,
} = require("../services/validation");
const {
  createUser,
  getEmailOrUsername,
  validatePassword,
  verifyEmail,
  signJwt,
} = require("../services/userServices");
const { createMail } = require("../services/sendMail");
const { encrypt, decrypt } = require("../services/encryptDecrypt");
const { responseHandler } = require("../services/responseHandler");

const userSignup = async (req, res) => {
  const { details } = await userSignupValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const check = await createUser(req.body);
  if (check[0]) {
    const { email } = check[2];
    const encryptedId = encrypt(email);
    let hashedId = encryptedId.iv.concat(encryptedId.content);
    await createMail(email, hashedId, "signup");
    return responseHandler(
      res,
      "Your verification email has been sent",
      201,
      false,
      ""
    );
  }
  return responseHandler(res, check[1], 400, true, "");
};

const userlogin = async (req, res) => {
  const { details } = await userLoginValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const { emailOrUsername, password } = req.body;
  const foundUser = await getEmailOrUsername(emailOrUsername);
  if (!foundUser) {
    return responseHandler(
      res,
      "Email or Password is incorrect",
      400,
      true,
      ""
    );
  }
  const check = await validatePassword(password, foundUser.password);
  console.log(check);
  if (check[0] === true) {
    return responseHandler(
      res,
      "Login succesful",
      200,
      false,
      signJwt(foundUser._id)
    );
  }
  return responseHandler(res, "Email or Password is incorrect", 400, true, "");
};

const verifyAccount = async (req, res) => {
  const { details } = await verifyEmailVerification(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { id } = req.body;
  let decrypted = decrypt({
    iv: id.substring(0, 32),
    content: id.substring(32, id.length),
  });
  if (await verifyEmail(decrypted)) {
    return responseHandler(res, "User email verified", 200, false, "");
  } else {
    return responseHandler(res, "Unable to verify user email", 400, true, "");
  }
};

module.exports = {
  userSignup,
  userlogin,
  verifyAccount,
};
