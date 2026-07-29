const express = require("express");
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/review.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.route("/").get(asyncHandler(getReviews)).post(asyncHandler(createReview));
router.route("/:id").get(asyncHandler(getReviewById)).put(asyncHandler(updateReview)).delete(asyncHandler(deleteReview));

module.exports = router;
