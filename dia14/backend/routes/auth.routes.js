const express = require("express");
const {
  register,
  login
} = require("../controllers/auth.controller");
const {
  verifyToken
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/verify", verifyToken, (req, res) => {
  res.json({
    message: "Usuario autenticado",
    logged: true,
    user: req.user
  });
});

module.exports = router;