const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(authorization);

  try {
    if (!authorization) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    const token = authorization.split(" ").pop();
    jwt.verify(token, process.env.SECRET, (err, result) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "The token is invalid or expired",
        });
      }
      req.token = result;
      next();
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = authentication;