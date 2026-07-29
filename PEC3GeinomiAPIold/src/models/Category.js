const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "El nombre de la categoría es obligatorio"], trim: true },
    slug: { type: String, required: [true, "El slug es obligatorio"], unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, "La descripción es obligatoria"], trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "categories" }
);

module.exports = mongoose.model("Category", categorySchema);
