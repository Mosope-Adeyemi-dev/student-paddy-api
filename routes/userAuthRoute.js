const router = require("express").Router();
const {
  userSignup,
  userlogin,
  verifyAccount,
} = require("../controllers/userAuthController");
router.post("/signup", userSignup);
router.post("/login", userlogin);
router.post("/verify-account", verifyAccount);
module.exports = router;
