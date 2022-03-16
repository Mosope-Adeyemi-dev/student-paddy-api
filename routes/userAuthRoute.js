const router = require("express").Router();
const { userSignup } = require("../controllers/userAuthController");
router.post("/signup", userSignup);

module.exports = router;
