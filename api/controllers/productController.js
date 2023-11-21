const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Product = require("../models/productModel");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, "../../uploads");
    console.log("Destination Path:", destinationPath);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    console.log("Original Filename:", file.originalname);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer(
  { storage: storage, limits: { fileSize: 1024 * 1024 * 5 } },
  fileFilter
);
exports.getAllProducts = (req, res) => {
  Product.find()
    .select("name price _id image")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            image: doc.image,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.getProductbyId = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId)
    .select("name price _id image")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

(exports.createProduct = upload.single("image")),
  (req, res) => {
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      image: req.file.path,
    });
    newProduct
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  };

exports.updateProduct = (req, res) => {
  const { productId } = req.params;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: productId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + productId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.params;
  Product.deleteOne({ _id: productId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          description: "Creates a new product",
          url: "http://localhost:3000/products",
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
};