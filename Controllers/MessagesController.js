const Messages = require('../Models/Messages');
const ChatBotUsers = require('./ChatBotUsersController')

let getMessages = async (req, res) => {
    try {
        let data = req.body
        let chatBotUser = await ChatBotUsers.getChatBotUser(data.facebookId);
        let messages = await Messages.find({chatBotUserId:chatBotUser._id});
        res.json(messages);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getMessages,
}