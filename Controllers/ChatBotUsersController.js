const ChatbotUser = require('../Models/ChatbotUsers');
const UserVisit = require('./UserVisitsController');
const utils = require('../Utils/utils');
const { $where } = require('../Models/ChatbotUsers');

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
        let chatBotUsersContacted = await UserVisit.getTimesVisited();
        let chatBotUsersActive = await UserVisit.getTimesVisited();
        let chatBotUsersHabitual = await UserVisit.getTimesVisited();
        let newChatBotUsers = [];
        // chatBotUsersVisited.forEach(element => {
        //     switch (element.state) {
        //         case 1:
        //             // let i = 0;
        //             // for (i = 0; i < chatBotUsersVisited.length; i++) {
        //             //     const element2 = chatBotUsersVisited[i];
        //             //     if (element._id.equals(element2._id)) {
        //             //         // element = {...element, timesVisited: element2.timesVisited};
        //             //         // console.log(element);
        //             //         const timesVisited = element2.timesVisited
        //             //         element.timesVisited = element2.timesVisited;
        //             //         console.log(element.timesVisited);
        //             //         break;
        //             //     }
        //             // }
        //             // console.log(element.timesVisited);
        //             // chatBotUsersVisited.splice(i, 1);
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