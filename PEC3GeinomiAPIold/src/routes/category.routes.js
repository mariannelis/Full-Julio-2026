const express = require("express");
const {
  getCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/category.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.route("/").get(asyncHandler(getCategorys)).post(asyncHandler(createCategory));
router.route("/:id").get(asyncHandler(getCategoryById)).put(asyncHandler(updateCategory)).delete(asyncHandler(deleteCategory));

module.exports = router;
