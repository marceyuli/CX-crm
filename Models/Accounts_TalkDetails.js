const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Accounts_TalkDetailSchema = new Schema({
    accountId: mongoose.SchemaTypes.ObjectId,
    talkDetailId: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model('accounts_talkdetails', Accounts_TalkDetailSchema);