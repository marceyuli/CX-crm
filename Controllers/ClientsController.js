const Client = require('../Models/Client');
const utils = require('../Utils/utils');

async function saveClientData(facebookId, parameters) {
    let isRegistered = await Client.findOne({ facebookId });
    if (isRegistered) {
        return;
    }
    let userData = await utils.getUserData(facebookId);
    let client = new Client({
        firstName: userData.first_name,
        lastName: userData.last_name,
        facebookId,
        profilePicture: userData.profile_pic,
        email: parameters.fields.email.stringValue,
        phoneNumber: parameters.fields.phoneNumber.stringValue
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