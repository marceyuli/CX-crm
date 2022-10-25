const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('accounts', AccountSchema);