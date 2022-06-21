const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ token: refreshToken }, (error, doc) => {
      if (error || !doc) {
        return reject({ error: true, message: "Invalid refresh token." });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (error, payload) => {
          if (error) {
            return reject({ error: true, message: "Invalid refresh token." });
          }

          resolve({
            payload,
            error: false,
            message: "Valid refresh token.",
          });
        }
      );
    });
  });
};

module.exports = verifyRefreshToken;
