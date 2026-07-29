const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productName: { type: String, required: [true, "El nombre del producto es obligatorio"] },
    quantity: { type: Number, required: [true, "La cantidad es obligatoria"], min: [1, "La cantidad mínima es 1"] },
    unitPrice: { type: Number, required: [true, "El precio unitario es obligatorio"], min: [0, "El precio no puede ser negativo"] }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: [true, "El email del usuario es obligatorio"], lowercase: true, trim: true },
    items: { type: [orderItemSchema], required: [true, "El pedido debe tener productos"] },
    total: { type: Number, required: [true, "El total es obligatorio"], min: [0, "El total no puede ser negativo"] },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
    shippingAddress: {
      city: { type: String, required: true },
      country: { type: String, required: true },
      addressLine: { type: String, required: true }
    },
    paymentMethod: { type: String, enum: ["card", "paypal", "bank_transfer", "cash"], default: "card" }
  },
  { timestamps: true, collection: "orders" }
);

module.exports = mongoose.model("Order", orderSchema);
