const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatbotUserSchema = new Schema({
    firstName: String,
    lastName: String,
    facebookId: String,
    profilePicture: String,
    email: String,
    phoneNumber: String,
    urlProfile: String,
    state: Number,    //[1,2,3,4] 1=Prospect,2=Contacted,3=Avtive,4=Habitual
}, { timestamps: true });

module.exports = mongoose.model('ChatbotUsers', ChatbotUserSchema);