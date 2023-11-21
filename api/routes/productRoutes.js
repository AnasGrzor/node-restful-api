const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  getAllProducts,
  getProductbyId,
  updateProduct,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getAllProducts);

router.get("/:productId", getProductbyId);

router.post("/", checkAuth, createProduct);

router.patch("/:productId", checkAuth, updateProduct);

router.delete("/:productId", checkAuth, deleteProduct);

module.exports = router;
