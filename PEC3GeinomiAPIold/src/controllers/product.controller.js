const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: products.length, data: products });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", data: product });
};

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ status: "success", message: "Producto creado correctamente", data: product });
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Producto actualizado correctamente", data: product });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Producto eliminado correctamente", data: product });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
