const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} = require("../controllers/order.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.route("/").get(asyncHandler(getOrders)).post(asyncHandler(createOrder));
router.route("/:id").get(asyncHandler(getOrderById)).put(asyncHandler(updateOrder)).delete(asyncHandler(deleteOrder));

module.exports = router;
