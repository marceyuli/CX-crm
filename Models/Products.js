const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    type: String,
    artist_id: mongoose.SchemaTypes.ObjectId,
    picture: String,
    promotion_id: mongoose.SchemaTypes.ObjectId
},);

module.exports = mongoose.model('products', ProductSchema)