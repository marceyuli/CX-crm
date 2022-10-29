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

// async function getTimesVisited(chatBotUserId){
//     return (await UserVisit.find({chatBotUserId})).length
// }
let getTimesVisited = async (req, res) => {
    var data = req.query;
    let timesVisited = (await UserVisit.find({ chatBotUserId: data._id })).length
    res.json(timesVisited);
}

let getLastVisit = async (req, res) => {
    var data = req.query;
    let lastUserVisit = await UserVisit.findOne({ chatBotUserId: data._id }).sort('-createdAt');
    console.log(lastUserVisit);
    res.json(lastUserVisit);
}
// async function getLastVisit(chatBotUserId){
//     let lastUserVisit = await UserVisit.findOne({chatBotUserId}).sort('-createdAt')
//     return lastUserVisit.createdAt;
// }

module.exports = {
    saveUserVisit,
    getTimesVisited,
    getLastVisit
}