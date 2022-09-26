const Client = require('../Models/Client');
const ChatBotUser = require('../Models/ChatbotUsers');

async function saveClientData(facebookId, parameters) {
    let isRegistered = await Client.findOne({ email:parameters.fields.email.stringValue });
    if (isRegistered) {
        return;
    }
    let chatBotUser = await ChatBotUser.findOne({facebookId});
    let client = new Client({
        email: parameters.fields.email.stringValue,
        phoneNumber: parameters.fields.phoneNumber.stringValue,
        chatBotUserId: chatBotUser._id
    })
    client.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un cliente: ", res);
    })
}

module.exports = {
    saveClientData
}