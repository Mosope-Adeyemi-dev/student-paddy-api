const { responseHandler } = require("../services/responseHandler");
const { checkJwt } = require("../services/userServices");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader !== undefined) {
    const token = bearerHeader.split(" ")[1];
    const check = await checkJwt(token);

    const { id, exp, err } = check;
    if (err) {
      return responseHandler(res, err, 403, false, "");
    }

    if (id && exp < Date.now()) {
      req.id = id;
      next();
      return;
    } else {
      return responseHandler(
        res,
        "Expired token, login & try again mate!",
        403,
        false,
        ""
      );
    }
  }
  return responseHandler(
    res,
    "No authorization token, who's this ?",
    403,
    false,
    ""
  );
};

module.exports = {
  verifyToken,
};
