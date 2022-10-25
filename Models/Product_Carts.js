//price
//quantity
//productId
//cardId
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product_CartsSchema = new Schema({
    price: Number,
    quantity: Number,
    productId: mongoose.SchemaTypes.ObjectId,
    cardId: mongoose.SchemaTypes.ObjectId,
})

module.exports = mongoose.model('product_carts', Product_CartsSchema);