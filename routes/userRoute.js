const express = require("express");
const auth = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/rolesMiddleware");
const router = express.Router();

router.get("/details", auth, roleCheck(["user"]), async (req, res) => {
  return res.status(200).json({ message: "user authenticated." });
});

module.exports = router;
