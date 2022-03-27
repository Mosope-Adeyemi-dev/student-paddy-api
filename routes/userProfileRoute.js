const router = require("express").Router();
const {
  userProfileUpdate,
  userForgotPassword,
  userResetPassword,
  getUserDetails,
  profileImageUpload,
} = require("../controllers/userProfileController");
const { verifyToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const { storage } = require("../services/cloudinary");
const upload = multer({ storage });

router.patch("/update", verifyToken, userProfileUpdate);
router.post("/forgot-password", userForgotPassword);
router.put("/reset-password", userResetPassword);
router.get("/:id", verifyToken, getUserDetails);
router.patch(
  "/upload/:imageType",
  upload.single("avatar"),
  verifyToken,
  profileImageUpload
);

module.exports = router;
