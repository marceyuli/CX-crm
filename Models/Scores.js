const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    punctuation: Number,
    chatBotUserId: mongoose.SchemaTypes.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model('scores', ScoreSchema)