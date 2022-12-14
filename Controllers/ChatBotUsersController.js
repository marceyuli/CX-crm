const ChatbotUser = require('../Models/ChatbotUsers');
const UserVisit = require('./UserVisitsController');
const TalkDetails = require('./TalkDetailsController');
const Orders = require('./OrdersController');
const utils = require('../Utils/utils');


async function saveUserData(facebookId) {
    let isRegistered = await ChatbotUser.findOne({ facebookId });
    if (isRegistered) {
        return;
    }
    let userData = await utils.getUserData(facebookId);
    let chatbotUser = new ChatbotUser({
        firstName: userData.first_name,
        lastName: userData.last_name,
        facebookId,
        profilePicture: userData.profile_pic
    })
    chatbotUser.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un usuario: ", res);
    })
}

//conecta al api, devuelve un array de arrays que contienen
//[0] prospecto 
//[1] clientes contactados
//[2] clientes activos
//[3] clientes habituales
let getUsersData = async (req, res) => {
    try {
        let chatBotUsersProspect = await UserVisit.getTimesVisitedLastVisit();
        let chatBotUsersContacted = await TalkDetails.getTimesContactedLastContact();
        let chatBotUsersActive = await Orders.getTimesOrderedLastOrder();
        let chatBotUsersHabitual = await Orders.getAvgTotalPriceCreatedAt();
        let newChatBotUsers = [];
        newChatBotUsers.push(chatBotUsersProspect);
        newChatBotUsers.push(chatBotUsersContacted);
        newChatBotUsers.push(chatBotUsersActive);
        newChatBotUsers.push(chatBotUsersHabitual);
        res.json(newChatBotUsers);
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    saveUserData,
    getUsersData
}