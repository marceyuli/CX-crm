const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    type: String,
    artist_id: String,
    picture: String,
    promotion_id: String
},);

module.exports = mongoose.model('products', ProductSchema)