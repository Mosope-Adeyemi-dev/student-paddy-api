const router = require("express").Router();
const {
  createPost,
  getUserPosts,
  getCommunityPosts,
} = require("../controllers/postController");
const { verifyToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const { storage } = require("../services/cloudinary");
const upload = multer({ storage });

router.post("/create", upload.single("file"), createPost);
router.get("/user/:userId", verifyToken, getUserPosts);
router.get("/community/:communityId", verifyToken, getCommunityPosts);
module.exports = router;
