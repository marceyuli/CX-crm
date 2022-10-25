const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    totalPrice: Number,
    chatBotUserId: mongoose.SchemaTypes.ObjectId,
    order: Boolean
},{timestamps:true});

module.exports = mongoose.model('orders', OrderSchema);