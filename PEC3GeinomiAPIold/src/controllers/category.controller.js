const Category = require("../models/Category");

const getCategorys = async (req, res) => {
  const items = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: items.length, data: items });
};

const getCategoryById = async (req, res) => {
  const item = await Category.findById(req.params.id);
  if (!item) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", data: item });
};

const createCategory = async (req, res) => {
  const item = await Category.create(req.body);
  res.status(201).json({ status: "success", message: "Categoría creada correctamente", data: item });
};

const updateCategory = async (req, res) => {
  const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Categoría actualizada correctamente", data: item });
};

const deleteCategory = async (req, res) => {
  const item = await Category.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Categoría eliminada correctamente", data: item });
};

module.exports = { getCategorys, getCategoryById, createCategory, updateCategory, deleteCategory };
