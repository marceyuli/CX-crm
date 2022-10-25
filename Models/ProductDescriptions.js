const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductDescriptionsSchema = new Schema({
    size: String,
    stock: Number,
    productId: mongoose.SchemaTypes.ObjectId
},);

module.exports = mongoose.model('productdescriptions', ProductDescriptionsSchema)