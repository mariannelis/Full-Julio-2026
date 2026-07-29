const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "El nombre del producto es obligatorio"], trim: true },
    description: { type: String, required: [true, "La descripción es obligatoria"], trim: true },
    category: { type: String, required: [true, "La categoría es obligatoria"], trim: true },
    price: { type: Number, required: [true, "El precio es obligatorio"], min: [0, "El precio no puede ser negativo"] },
    stock: { type: Number, required: [true, "El stock es obligatorio"], min: [0, "El stock no puede ser negativo"] },
    capacity: { type: String, trim: true },
    weight: { type: String, trim: true },
    material: { type: String, trim: true },
    color: { type: String, trim: true },
    image: { type: String, trim: true },
    status: { type: String, enum: ["available", "out_of_stock", "discontinued"], default: "available" },
    featured: { type: Boolean, default: false },
    createdBy: { type: String, required: [true, "El creador del producto es obligatorio"], trim: true }
  },
  { timestamps: true, collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);
