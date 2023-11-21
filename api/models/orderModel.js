const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        ref: "Product"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1 // default value
    }
});
 
module.exports = mongoose.model("Order", orderSchema);
