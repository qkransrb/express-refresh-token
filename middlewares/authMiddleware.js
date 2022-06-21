const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer")) {
    return res.status(403).json({
      error: true,
      message: "Access denied: No token provided.",
    });
  }

  try {
    const payload = jwt.verify(
      token.substring(7),
      process.env.ACCESS_TOKEN_KEY
    );

    req.user = payload;

    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: "Access denied: No token provided.",
    });
  }
};

module.exports = auth;
