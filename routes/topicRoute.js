const router = require("express").Router();
const {
  createTopic,
  followTopic,
  findTopic,
  getCommunityTopics,
} = require("../controllers/topicController");
router.post("/create", createTopic);
router.put("/follow", followTopic);
router.get("/search", findTopic);
router.get("/:communityId", getCommunityTopics);
module.exports = router;
