const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    type: String,
    artistId: mongoose.SchemaTypes.ObjectId,
    picture: String,
    price: Number,
},);

module.exports = mongoose.model('products', ProductSchema)