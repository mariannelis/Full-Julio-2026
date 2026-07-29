const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "El nombre es obligatorio"], trim: true },
    email: { type: String, required: [true, "El email es obligatorio"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "La contraseña es obligatoria"] },
    role: { type: String, enum: ["admin", "customer", "editor"], default: "customer" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
