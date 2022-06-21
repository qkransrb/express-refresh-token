const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, roles: user.roles };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "14m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "30d",
    });

    const userToken = await Token.findOne({ userId: user._id });

    if (userToken) {
      await Token.remove();
    }

    await new Token({
      userId: user._id,
      token: refreshToken,
    }).save();

    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = generateTokens;
