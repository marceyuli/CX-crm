const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    score: Number,
    chatBotUserId: mongoose.SchemaTypes.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model('scores', ScoreSchema)