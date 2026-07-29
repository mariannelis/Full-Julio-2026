const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.route("/").get(asyncHandler(getUsers)).post(asyncHandler(createUser));
router.route("/:id").get(asyncHandler(getUserById)).put(asyncHandler(updateUser)).delete(asyncHandler(deleteUser));

module.exports = router;
