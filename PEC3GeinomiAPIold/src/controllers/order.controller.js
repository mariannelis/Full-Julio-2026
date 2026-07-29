const Order = require("../models/Order");

const getOrders = async (req, res) => {
  const items = await Order.find().sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: items.length, data: items });
};

const getOrderById = async (req, res) => {
  const item = await Order.findById(req.params.id);
  if (!item) {
    const error = new Error("Pedido no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", data: item });
};

const createOrder = async (req, res) => {
  const item = await Order.create(req.body);
  res.status(201).json({ status: "success", message: "Pedido creada correctamente", data: item });
};

const updateOrder = async (req, res) => {
  const item = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error("Pedido no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Pedido actualizada correctamente", data: item });
};

const deleteOrder = async (req, res) => {
  const item = await Order.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error("Pedido no encontrada");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Pedido eliminada correctamente", data: item });
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
