const express = require("express");

const productRoutes = require("./product.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const orderRoutes = require("./order.routes");
const reviewRoutes = require("./review.routes");
const notFound = require("../middlewares/notFound");
const errorHandler = require("../middlewares/errorHandler");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API REST de Geinomi funcionando correctamente",
    endpoints: {
      products: "/api/products",
      users: "/api/users",
      categories: "/api/categories",
      orders: "/api/orders",
      reviews: "/api/reviews"
    }
  });
});

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);

router.use(notFound);
router.use(errorHandler);

module.exports = router;
