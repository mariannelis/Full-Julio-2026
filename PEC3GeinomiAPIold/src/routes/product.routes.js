const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.route("/").get(asyncHandler(getProducts)).post(asyncHandler(createProduct));
router.route("/:id").get(asyncHandler(getProductById)).put(asyncHandler(updateProduct)).delete(asyncHandler(deleteProduct));

module.exports = router;
