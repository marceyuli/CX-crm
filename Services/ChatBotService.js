var request = require("request");

//libraries
const axios = require("axios");
const ChatbotUser = require('../Models/ChatbotUsers');
const Client = require('../Models/Client');


async function saveUserData(facebookId) {
    let isRegistered = await ChatbotUser.findOne({ facebookId });
    if (isRegistered) {
        return;
    }
    let userData = await getUserData(facebookId);
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

async function saveClientData(facebookId, parameters) {
    let isRegistered = await Client.findOne({ facebookId });
    if (isRegistered) {
        return;
    }
    let userData = await getUserData(facebookId);
    let client = new Client({
        firstName: userData.first_name,
        lastName: userData.last_name,
        facebookId,
        profilePicture: userData.profile_pic,
        email: parameters.fields.email,
        phoneNumber: parameters.fields.phoneNumber
    })
    client.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un cliente: ", res);
    })
}

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
            saveUserData(sender);
            handleMessages(messages, sender);
            break;
        case "DatosRecibidos.action":
            console.log(parameters.fields.phoneNumber.stringValue);
            console.log(parameters.fields.email['stringValue']);
            if (parameters.fields.phoneNumber.stringValue != '' && parameters.fields.email['stringValue'] != '') {
                saveClientData(sender, parameters);
            }
            handleMessages(messages, sender);
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




async function getUserData(senderId) {
    console.log("consiguiendo datos del usuario...");
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        let userData = await axios.get(
            "https://graph.facebook.com/v6.0/" + senderId,
            {
                params: {
                    access_token,
                },
            }
        );
        return userData.data;
    } catch (err) {
        console.log("algo salio mal en axios getUserData: ", err);
        return {
            first_name: "",
            last_name: "",
            profile_pic: "",
        };
    }
}

async function sendTextMessage(recipientId, text) {
    if (text.includes("{first_name}")) {
        let userData = await getUserData(recipientId);
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
    saveUserData,
    handleDialogFlowResponse,
    sendTypingOn,
    
}