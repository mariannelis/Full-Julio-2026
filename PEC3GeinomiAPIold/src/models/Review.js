const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productName: { type: String, required: [true, "El producto reseñado es obligatorio"], trim: true },
    userEmail: { type: String, required: [true, "El usuario de la reseña es obligatorio"], lowercase: true, trim: true },
    rating: { type: Number, required: [true, "La valoración es obligatoria"], min: [1, "La valoración mínima es 1"], max: [5, "La valoración máxima es 5"] },
    comment: { type: String, required: [true, "El comentario es obligatorio"], trim: true },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "reviews" }
);

module.exports = mongoose.model("Review", reviewSchema);
