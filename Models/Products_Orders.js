const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product_OrderSchema = new Schema({
    price: Number,
    quantity: Number,
    size: String,
    orderId: mongoose.SchemaTypes.ObjectId,
    productId: mongoose.SchemaTypes.ObjectId
}, { timestamps: true });

module.exports = mongoose.model('product_orders', Product_OrderSchema);