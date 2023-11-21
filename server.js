require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;
const morgan = require("morgan");
const mongoose = require("mongoose");
const productRoutes = require("./api/routes/productRoutes");
const orderRoutes = require("./api/routes/orderRoutes");
const userRoutes = require("./api/routes/userRoutes");

app.use(express.json());
app.use("/uploads",express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("First API");
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
connect = async () => {
  await mongoose.connect(process.env.DB_CONN);
  console.log("Connected to DB");
};

app.listen(PORT, () => {
  connect();
  console.log(`Listening on ${PORT}`);
});
