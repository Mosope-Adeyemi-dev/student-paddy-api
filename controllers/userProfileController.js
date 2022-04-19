// const User = require("../models/userModel");
const { responseHandler } = require("../services/responseHandler");
const {
  updateUserDetails,
  getEmailOrUsername,
  updatePassword,
  updateUserImages,
  getUserByID,
  changeAccountState,
} = require("../services/userServices");
const {
  userSetProfileValidation,
  userforgotPasswordValidation,
  userResetPasswordValidation,
} = require("../services/validation");
const { createMail } = require("../services/sendMail");
const { encrypt, decrypt } = require("../services/encryptDecrypt");

const userProfileUpdate = async (req, res) => {
  const { details } = await userSetProfileValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const check = await updateUserDetails(req.body, req.id);
  if (check[0]) {
    return responseHandler(res, "Profile succesfully updated", 201, false, "");
  }
  return responseHandler(res, check[1], 400, true, "");
};

const userForgotPassword = async (req, res) => {
  const { details } = await userforgotPasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const foundUser = await getEmailOrUsername(req.body.email);
  if (foundUser) {
    const { email } = foundUser;

    const encryptedId = encrypt(email);
    let hashedId = encryptedId.iv.concat(encryptedId.content);
    await createMail(email, hashedId, "resetPassword");

    return responseHandler(
      res,
      "Reset password email has been sent",
      200,
      false,
      ""
    );
  }
  return responseHandler(
    res,
    "Unable to send reset password email",
    404,
    false,
    ""
  );
};

//user reset password
const userResetPassword = async (req, res) => {
  const { details } = await userResetPasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { password, confirmPassword, id } = req.body;
  if (password !== confirmPassword) {
    return responseHandler(res, "Passwords do not match", 400, true, "");
  }
  let decryptedEmail = decrypt({
    iv: id.substring(0, 32),
    content: id.substring(32, id.length),
  });

  let foundUser = await getEmailOrUsername(decryptedEmail);
  if (!foundUser) {
    return responseHandler(res, "Unable to reset password", 400, true, "");
  }

  if (await updatePassword(password, decryptedEmail)) {
    return responseHandler(res, "Password reset successfully", 200, false, "");
  }
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;

  const check = await getUserByID(id);
  if (check[0]) {
    return responseHandler(
      res,
      "User details retrived succesfully",
      200,
      false,
      check[1]
    );
  }
  return responseHandler(res, check[1], 400, true, "");
};

const profileImageUpload = async (req, res) => {
  if (req.file == undefined) {
    return responseHandler(res, "Include an image to upload", 400, true, "");
  }

  const { imageType } = req.params;
  const { id } = req.body;

  if (imageType != "photo" && imageType != "coverphoto") {
    return responseHandler(res, "Include a valid image type", 400, true, "");
  }
  const avatar = req.file.path;
  const updatedProfile = await updateUserImages(imageType, avatar, id);

  if (updatedProfile) {
    return responseHandler(res, `image uploaded successfully`, 200, false, {
      imageUrl: avatar,
    });
  }
  return responseHandler(
    res,
    "An error occured, image upload failed",
    400,
    true,
    ""
  );
};

const deleteUser = async (req, res) => {
  if (req.params.id == undefined)
    return responseHandler(res, "Include a valid user id", 400, true, "");

  const { id } = req.params;
  const result = await changeAccountState(id);
  if (result)
    return responseHandler(
      res,
      "User account deleted succesfully",
      204,
      false,
      ""
    );
  return responseHandler(res, "Unable to delete user account", 400, true, "");
};

module.exports = {
  userProfileUpdate,
  userResetPassword,
  userForgotPassword,
  getUserDetails,
  profileImageUpload,
  deleteUser,
};
