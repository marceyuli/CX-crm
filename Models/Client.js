const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    email: String,
    phoneNumber: String,
    chatBotUserId: mongoose.SchemaTypes.ObjectId
}, { timestamps: true });

module.exports = mongoose.model('client', ClientSchema);