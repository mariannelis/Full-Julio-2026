import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true
        },

        descripcion: {
            type: String,
            trim: true
        },

        precio: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [0.01, "El precio debe ser mayor que cero"]
        },

        stock: {
            type: Number,
            required: [true, "El stock es obligatorio"],
            min: [0, "El stock no puede ser negativo"],
            validate: {
                validator: Number.isInteger,
                message: "El stock debe ser un número entero"
            }
        },

        categoria: {
            type: String,
            required: [true, "La categoría es obligatoria"],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;