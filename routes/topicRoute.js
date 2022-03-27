const router = require("express").Router();
const { createTopic, followTopic } = require("../controllers/topicController");
router.post("/create", createTopic);
router.put("/follow", followTopic);
module.exports = router;
