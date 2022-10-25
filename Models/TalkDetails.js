const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TalkDetailSchema = new Schema({
    content: String,
    socialMedia: String,
}, {timestamps: true});

module.exports = mongoose.model('talkdetails', TalkDetailSchema);
