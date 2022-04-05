const router = require("express").Router();
const {
  createCommunity,
  followCommunity,
  getCommunities,
  getCommunityDetails,
} = require("../controllers/communityController");
const multer = require("multer");
const { storage } = require("../services/cloudinary");
const upload = multer({ storage });

router.post("/create", upload.single("coverPhoto"), createCommunity);
router.put("/follow", followCommunity);
router.get("/", getCommunities);
router.get("/:communityId", getCommunityDetails);
module.exports = router;
