const ChatbotUser = require('../Models/ChatbotUsers');
const UserVisit = require('./UserVisitsController');
const TalkDetails = require('./TalkDetailsController');
const Orders = require('./OrdersController');
const utils = require('../Utils/utils');
const Products_Orders = require('./Products_OrdersController');


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
        profilePicture: userData.profile_pic,
        phoneNumber: "",
        email: "",
        state: 1,
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

let getActiveClientData = async (req, res) => {
    try {
        let data = req.body
        let chatBotUser = await ChatbotUser.findOne({ facebookId:data.facebookId });
        let activeClient = await Products_Orders.getActiveClientData(chatBotUser);
        res.json(activeClient);
    } catch (error) {
        console.log(error);
    }
}

async function haveData(facebookId) {
    let chatBotUser = await ChatbotUser.findOne({ facebookId });
    let res = "";
    if (chatBotUser.email != '' && chatBotUser.phoneNumber != '') {
        res = chatBotUser.email + " " + chatBotUser.phoneNumber;
    }
    return res;
}

async function updateData(facebookId, phoneNumber, email) {
    await ChatbotUser.updateOne(
        {
            facebookId
        },
        {
            $set: {
                email,
                phoneNumber,
            },
            $currentDate: {
                lastModified: true,
            }
        }
    );
}

async function getChatBotUser(facebookId){
    return await ChatbotUser.findOne({ facebookId})
}

module.exports = {
    saveUserData,
    getUsersData,
    haveData,
    updateData,
    getActiveClientData,
    getChatBotUser
}