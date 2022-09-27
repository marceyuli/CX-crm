const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatBotUsers_ProductsSchema = new Schema({
    chatBotUserId: mongoose.SchemaTypes.ObjectId,
    productId: mongoose.SchemaTypes.ObjectId
}, { timestamps: true });

module.exports = mongoose.model('chatbotusers_products', ChatBotUsers_ProductsSchema);