const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: String,
    picture: String,
    chatBotUserId: mongoose.SchemaTypes.ObjectId
}, {timestamps: true });

module.exports = mongoose.model('messages', MessageSchema);