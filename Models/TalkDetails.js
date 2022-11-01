const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TalkDetailSchema = new Schema({
    content: String,
    socialMedia: String,
    chatBotUserId: mongoose.SchemaTypes.ObjectId,
    accountId: String,
    dateContacted: mongoose.SchemaTypes.Date,
}, {timestamps: true});

module.exports = mongoose.model('talkdetails', TalkDetailSchema);
