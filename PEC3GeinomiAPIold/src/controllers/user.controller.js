const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: users.length, data: users });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", data: user });
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  const userResponse = user.toObject();
  delete userResponse.password;
  res.status(201).json({ status: "success", message: "Usuario creado correctamente", data: userResponse });
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select("-password");
  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Usuario actualizado correctamente", data: user });
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id).select("-password");
  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ status: "success", message: "Usuario eliminado correctamente", data: user });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
