const express = require("express");
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const { refreshTokenValidation } = require("../utils/validationSchema");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const router = express.Router();

// get new access token
router.post("/", async (req, res) => {
  const { error } = refreshTokenValidation(req.body);

  if (error) {
    return res
      .status(401)
      .json({ error: true, message: error.details[0].message });
  }

  const { refreshToken } = req.body;

  verifyRefreshToken(refreshToken)
    .then((details) => {
      const payload = { _id: details._id, roles: details.roles };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: "14m",
      });
      return res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully.",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.delete("/", async (req, res) => {
  try {
    const { error } = refreshTokenValidation(req.body);

    if (error) {
      return res
        .status(401)
        .json({ error: true, message: error.details[0].message });
    }

    const { refreshToken } = req.body;

    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
      return res
        .status(200)
        .json({ error: false, message: "Logout successfully." });
    }

    await token.remove();

    return res
      .status(200)
      .json({ error: false, message: "Logout successfully." });
  } catch (error) {
    console.error("[logout] error: ", error);
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
