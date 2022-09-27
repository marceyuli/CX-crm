var request = require("request");

//libraries
const Artists = require('../Controllers/ArtistController');
const utils = require('../Utils/utils');
const ChatBotUsers = require('../Controllers/ChatBotUsersController');
const Clients = require('../Controllers/ClientsController');
const Promotions = require('../Controllers/PromotionController');
const Products = require('../Controllers/ProductController');
const ProductDescriptions = require('../Controllers/ProductDescriptionsController');

function handleDialogFlowResponse(sender, response) {
    let responseText = response.fulfillmentText;
    let messages = response.fulfillmentMessages;
    let action = response.action;
    let contexts = response.outputContexts;
    let parameters = response.parameters;
    sendTypingOff(sender);

    if (isDefined(action)) {
        handleDialogFlowAction(sender, action, messages, contexts, parameters);
    } else if (isDefined(messages)) {
        handleMessages(messages, sender);
    } else if (responseText == "" && !isDefined(action)) {
        //dialogflow could not evaluate input.
        sendTextMessage(sender, "No entiendo lo que trataste de decir ...");
    } else if (isDefined(responseText)) {
        sendTextMessage(sender, responseText);
    }
}


async function handleDialogFlowAction(
    sender,
    action,
    messages,
    contexts,
    parameters
) {
    switch (action) {
        case "input.welcome":
            ChatBotUsers.saveUserData(sender);
            handleMessages(messages, sender);
            break;
        case "Promociones.action":
            let promotions = await Promotions.getPromotionsDescription();
            console.log(promotions);
            sendTextMessage(sender, promotions);
            // handleMessages(messages, sender);
            break;
        case "FallbackArtista.action":
            let artists = await Artists.getArtistsInText();
            sendTextMessage(sender, artists);
            break;
        case "ArtistaPrendaEspecifica.action":
            sendTextMessage(sender, "tenemos disponibles las siguientes prendas de " + parameters.fields.NombreDeArtista.stringValue);
            let product = await Products.getProductsByArtistName(parameters.fields.NombreDeArtista.stringValue);
            product.forEach(element => {
                sendImageMessage(sender, element.picture);
            });
            break;
        case "ArtistaPrendaYTalla.action":
            if (parameters.fields.Talla.stringValue == '' || parameters.fields.NombreDePrenda.stringValue == '' || parameters.fields.Prenda.stringValue == '') {
                handleMessages(messages, sender);
            }
            let res = await ProductDescriptions.getPrice(parameters.fields.Talla.stringValue, parameters.fields.NombreDePrenda.stringValue, parameters.fields.Prenda.stringValue);
            sendTextMessage(sender, res);
            break;
        case "DatosRecibidos.action":
            if (parameters.fields.phoneNumber.stringValue != '' && parameters.fields.email.stringValue != '') {
                Clients.saveClientData(sender, parameters);
            }
            
            break;
        default:
            //unhandled action, just send back the text
            handleMessages(messages, sender);
    }
}

async function handleMessage(message, sender) {
    switch (message.message) {
        case "text": // text
            for (const text of message.text.text) {
                if (text !== "") {
                    await sendTextMessage(sender, text);
                }
            }
            break;
        case "image":
            await sendImageMessage(sender, message.image.imageUri);
            break;
        case "quickReplies": // quick replies
            let replies = [];
            message.quickReplies.quickReplies.forEach((text) => {
                let reply = {
                    content_type: "text",
                    title: text,
                    payload: text,
                };
                replies.push(reply);
            });
            await sendQuickReply(sender, message.quickReplies.title, replies);
            break;
        default:
            break;
    }
}


async function handleMessages(messages, sender) {
    try {
        let i = 0;
        while (i < messages.length) {
            switch (messages[i].message) {
                case "text":
                    await handleMessage(messages[i], sender);
                    break;
                case "image":
                    await handleMessage(messages[i], sender);
                    break;
                case "quickReplies":
                    await handleMessage(messages[i], sender);
                    break;
                default:
                    break;
            }
            i += 1;
        }
    } catch (error) {
        console.log(error);
    }
}

async function sendTextMessage(recipientId, text) {
    if (text.includes("{first_name}")) {
        let userData = await utils.getUserData(recipientId);
        text = text
            .replace("{first_name}", userData.first_name);
    }
    var messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: text,
        },
    };
    await callSendAPI(messageData);
}

async function sendImageMessage(recipientId, imageUrl) {
    var messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: imageUrl,
                },
            },
        },
    };
    await callSendAPI(messageData);
}

async function sendQuickReply(recipientId, text, replies, metadata) {
    var messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: text,
            metadata: isDefined(metadata) ? metadata : "",
            quick_replies: replies,
        },
    };

    await callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId,
        },
        sender_action: "typing_on",
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId,
        },
        sender_action: "typing_off",
    };

    callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
    return new Promise((resolve, reject) => {
        request(
            {
                uri: "https://graph.facebook.com/v6.0/me/messages",
                qs: {
                    access_token: process.env.PAGE_ACCESS_TOKEN,
                },
                method: "POST",
                json: messageData,
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var recipientId = body.recipient_id;
                    var messageId = body.message_id;

                    if (messageId) {
                        console.log(
                            "Successfully sent message with id %s to recipient %s",
                            messageId,
                            recipientId
                        );
                    } else {
                        console.log(
                            "Successfully called Send API for recipient %s",
                            recipientId
                        );
                    }
                    resolve();
                } else {
                    reject();
                    console.error(
                        "Failed calling Send API",
                        response.statusCode,
                        response.statusMessage,
                        body.error
                    );
                }
            }
        );
    });
}

function isDefined(obj) {
    if (typeof obj == "undefined") {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}

module.exports = {
    handleDialogFlowResponse,
    sendTypingOn,
}