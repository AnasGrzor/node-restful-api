const mongoose = require("mongoose");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.getAllOrders =  (req, res) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            count: doc.length,
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    });
};

exports.getOrderbyId = (req, res) => {
  const { id } = req.params;
  Order.findById(id)
    .populate("product")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          order: doc,
          request: {
            type: "GET",
            description: "Get all orders",
            url: "http://localhost:3000/orders",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    });
};

exports.createOrder = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product);

    if (!product) {
      return res
        .status(404)
        .json({ message: "No valid entry found for provided ID" });
    }

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      name: product.name,
      quantity: req.body.quantity,
      product: req.body.product,
    });

    const result = await order.save();

    res.status(201).json({
      message: "Order stored",
      createdOrder: {
        _id: result._id,
        name: result.name,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + result._id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.deleteOrder = (req, res) => {
  const { orderId } = req.params;
  Order.deleteOne({ _id: orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          description: "Creates a new order",
          url: "http://localhost:3000/orders",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
}