const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const {
  signupValidation,
  loginValidation,
} = require("../utils/validationSchema");
const generateTokens = require("../utils/generateTokens");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { error } = signupValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ error: true, message: "User already exist." });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const encryptPassword = await bcrypt.hash(password, salt);

    await new User({
      name,
      email,
      password: encryptPassword,
    }).save();

    return res
      .status(201)
      .json({ error: false, message: "Account created successfully." });
  } catch (error) {
    console.error("[signup] error: ", error);
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid user credentials." });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid user credentials." });
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateTokens(user);

    return res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Login successfully.",
    });
  } catch (error) {
    console.error("[login] error: ", error);
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
