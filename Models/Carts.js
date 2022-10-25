const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    totalPrice: Number,
    chatBotUserId : mongoose.SchemaTypes.ObjectId,
})

module.exports = mongoose.model('carts', CartSchema)