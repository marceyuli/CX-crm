const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromotionSchema = new Schema({
    description: String,
    discount: Number,
    picture: String,
}, { timestamps: true });

module.exports = mongoose.model('promotions', PromotionSchema)