const ChatbotUsers = require("../Models/ChatbotUsers");
const Scores = require("../Models/Scores");


async function saveScore(facebookId, score) {
    let chatBotUser = await ChatbotUsers.findOne({ facebookId });
    let scores = new Scores({
        score,
        chatBotUserId: chatBotUser._id
    })
    scores.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un score: ", res);
    })
}

module.exports = {
    saveScore
}