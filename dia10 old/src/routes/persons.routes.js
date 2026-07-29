const express = require("express");
const personController = require(
  "controllers/person.controller"
);

const router = express.Router();

router.get("/", personController.list);
router.get("/:id", personController.getById);

module.exports = router;