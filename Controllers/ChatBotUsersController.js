const ChatbotUser = require('../Models/ChatbotUsers');
const UserVisit = require('./UserVisitsController');
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
    console.log(req);
    var data = req.body;
    console.log(state);
    console.log(data);
    let chatBotUsers = await ChatbotUser.find({ state: data.state });
    console.log(chatBotUsers);
    res.json(chatBotUsers);
    // let chatBotUsers = await ChatbotUser.find()
    // let newChatBotUsers = [];
    // let newChatBotUsers1 = [];
    // let newChatBotUsers2 = [];
    // let newChatBotUsers3 = [];
    // let newChatBotUsers4 = [];
    // chatBotUsers.forEach(element => {
    //     switch (element.state) {
    //         case 1:
    //             newChatBotUsers1.push(element);
    //             break;
    //         case 2:
    //             newChatBotUsers2.push(element);
    //             break;
    //         case 3:
    //             newChatBotUsers3.push(element);
    //             break;
    //         case 4:
    //             newChatBotUsers4.push(element);
    //             break;
    //         default:
    //             break;
    //     }
    // });
    // newChatBotUsers.push(newChatBotUsers1);
    // newChatBotUsers.push(newChatBotUsers2);
    // newChatBotUsers.push(newChatBotUsers3);
    // newChatBotUsers.push(newChatBotUsers4);
    // res.json(newChatBotUsers);
}

// async function getUsersByState(state) {
//     return await ChatbotUser.find({ state })
// }

let getTimesVisited = async (req, res) => {
    var data = req.body;
    console.log(data);
    let chatBotUsersTimesVisited = (await ChatbotUser.find({ _id: data._id })).length
    console.log(chatBotUsersTimesVisited);
    res.json(chatBotUsersTimesVisited);
}
// async function getTimesVisited(chatBotUserId) {
//     return await UserVisit.getTimesVisited(chatBotUserId);
// }

async function getLastVisit(chatBotUserId) {
    return await UserVisit.getLastVisit(chatBotUserId);
}



module.exports = {
    saveUserData,
    // getUsersByState,
    getTimesVisited,
    getLastVisit,
    getUsersData
}