const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const { getAllOrders, getOrderbyId, createOrder, deleteOrder } = require("../controllers/orderController");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");

router.get("/",checkAuth,getAllOrders);

router.get("/:id", checkAuth, getOrderbyId);

// router.post("/", (req, res) => {
//   Product.findById(req.body.product)
//     .then((product) => {
//       if (product) {
//         const order = new Order({
//           _id: new mongoose.Types.ObjectId(),
//           name: product.name,
//           quantity: req.body.quantity,
//           product: req.body.product,
//         });

//         return order.save();
//       } else {
//         return res
//           .status(404)
//           .json({ message: "No valid entry found for provided ID" });
//       }
//     })
//     .then((result) => {
//       res.status(201).json({
//         message: "Order stored",
//         createdOrder: {
//           _id: result._id,
//           name: result.name,
//           product: result.product,
//           quantity: result.quantity,
//         },
//         request: {
//           type: "GET",
//           url: "http://localhost:3000/orders/" + result._id,
//         },
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// });

router.post("/", checkAuth,createOrder);

router.delete("/:orderId", checkAuth,deleteOrder);



module.exports = router;

