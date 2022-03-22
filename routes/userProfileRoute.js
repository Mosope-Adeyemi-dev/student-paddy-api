const router = require("express").Router();
const {
  userProfileUpdate,
  userForgotPassword,
  userResetPassword,
  getUserDetails,
} = require("../controllers/userProfileController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.put("/update", verifyToken, userProfileUpdate);
router.post("/forgot-password", userForgotPassword);
router.put("/reset-password", userResetPassword);
router.get("/:id", verifyToken, getUserDetails);

module.exports = router;
