const Review = require("../models/Review");

const getReviews = async (req, res) => {
  const items = await Review.find().sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: items.length, data: items });
};

const getReviewById = async (req, res) => {
  const item = await Review.findById(req.params.id);
  if (!item) {
    const error = new Error("Reseña no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", data: item });
};

const createReview = async (req, res) => {
  const item = await Review.create(req.body);
  res.status(201).json({ status: "success", message: "Reseña creada correctamente", data: item });
};

const updateReview = async (req, res) => {
  const item = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error("Reseña no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Reseña actualizada correctamente", data: item });
};

const deleteReview = async (req, res) => {
  const item = await Review.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error("Reseña no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Reseña eliminada correctamente", data: item });
};

module.exports = { getReviews, getReviewById, createReview, updateReview, deleteReview };
