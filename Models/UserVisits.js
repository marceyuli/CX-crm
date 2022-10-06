const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVisitsSchema = new Schema({
    chatBotUserId: mongoose.SchemaTypes.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model('UserVisits', UserVisitsSchema);