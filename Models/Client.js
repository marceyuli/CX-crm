const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    firstName: String,
    lastName: String,
    facebookId: String,
    profilePicture: String,
    email: String,
    phoneNumber: String
}, { timestamps: true });

module.exports = mongoose.model('client', ClientSchema);