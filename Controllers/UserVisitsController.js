const ChatBotUser = require("../Models/ChatbotUsers");
const UserVisit = require("../Models/UserVisits");

async function saveUserVisit(facebookId){
    let chatBotUser = await ChatBotUser.findOne({facebookId});
    let userVisit = new UserVisit({
        chatBotUserId: chatBotUser._id, 
    });
    userVisit.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un userVisit: ", res);
    });
}

module.exports = {
    saveUserVisit
}