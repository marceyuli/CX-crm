const Messages = require('../Models/Messages');
const ChatBotUsers = require('./ChatBotUsersController');
const ChatBotService = require('../Services/ChatBotService');

//encuentra un usuario y se crea un nuevo Mensaje
async function createMessage(facebookId, text, picture) {
    let chatBotUser = await ChatBotUsers.getChatBotUser(facebookId);
    let message = new Messages({
        text,
        picture,
        chatBotUserId: chatBotUser._id
    })
    message.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un Mensaje: ", res);
    })
}

//conecta con api, guarda un mensaje y envia el mensaje
let saveMessage = async (req, res) => {
    try {
        let data = req.body;
        let userData = data[0];
        let message = data[1];
        await saveAndSendMessage(userData.facebookId, message.text, message.picture);
        res.json("ok");
    } catch (error) {
        console.log(error);
    }
}

//crea y envia el mensaje
async function saveAndSendMessage(facebookId, text, picture) {
    await createMessage(facebookId, text, picture);
    await sendMessage(facebookId, text);
    await sendImage(facebookId, picture)
}

//envia el mensaje
async function sendMessage(facebookId, text) {
    await ChatBotService.sendTextMessage(facebookId, text);
}

async function sendImage(facebookId, imageUrl) {
    await ChatBotService.sendImageMessage(facebookId, imageUrl);
}

//conecta con api, devuelve todos los mensajes
let getMessages = async (req, res) => {
    try {
        let data = req.body
        let chatBotUser = await ChatBotUsers.getChatBotUser(data.facebookId);
        let messages = await Messages.find({ chatBotUserId: chatBotUser._id });
        res.json(messages);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getMessages,
    createMessage,
    sendMessage,
    saveMessage,
    saveAndSendMessage
}