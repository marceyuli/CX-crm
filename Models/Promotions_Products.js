const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Promotions_ProductsSchema = new Schema({
    promotionsId: mongoose.SchemaTypes.ObjectId,
    productId: mongoose.SchemaTypes.ObjectId
}, { timestamps: true });

module.exports = mongoose.model('promotions_products', ChatBotUsers_ProductsSchema);