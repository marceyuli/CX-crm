const ChatbotUser = require('../Models/ChatbotUsers');
const UserVisit = require('./UserVisitsController');
const TalkDetails = require('./TalkDetailsController');
const Orders = require('./OrderController');
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

let getUsersData = async (req, res) => {
    try {
        // let chatBotUsers = await ChatbotUser.find({})
        let chatBotUsersProspect = await UserVisit.getTimesVisited();
        // let chatBotUsersProspect = [];
        let chatBotUsersContacted = await TalkDetails.getTimesContactedLastContact();
        // let chatBotUsersActive = [];
        let chatBotUsersActive = await Orders.getTimesOrderedLastOrder();
        // let chatBotUsersHabitual = [];
        let chatBotUsersHabitual = await Orders.getAvgTotalPriceCreatedAt();
        console.log(chatBotUsersHabitual);
        let newChatBotUsers = [];
        newChatBotUsers.push(chatBotUsersProspect);
        newChatBotUsers.push(chatBotUsersContacted);
        newChatBotUsers.push(chatBotUsersActive);
        newChatBotUsers.push(chatBotUsersHabitual);
        // console.log(newChatBotUsers);
        res.json(newChatBotUsers);
    } catch (error) {
        console.log(error);
    }
    // var data = req.query;
    // let chatBotUsers = await ChatbotUser.find({ state: data.state });
    // res.json(chatBotUsers);

}

// async function getUsersByState(state) {
//     return await ChatbotUser.find({ state })
// }

// let getTimesVisited = async (req, res) => {
//     var data = req.query;
//     let timesVisited = (await UserVisit.find({ chatBotUserId: data._id })).length
//     res.json(timesVisited);
// }
// async function getTimesVisited(chatBotUserId) {
//     return await UserVisit.getTimesVisited(chatBotUserId);
// }

async function getLastVisit(chatBotUserId) {
    return await UserVisit.getLastVisit(chatBotUserId);
}



module.exports = {
    saveUserData,
    // getUsersByState,
    // getTimesVisited,
    getLastVisit,
    getUsersData
}