var request = require("request");

//libraries
const Artists = require('../Controllers/ArtistController');
const utils = require('../Utils/utils');
const ChatBotUsers = require('../Controllers/ChatBotUsersController');
const Promotions = require('../Controllers/PromotionController');
const Products = require('../Controllers/ProductController');
const ProductDescriptions = require('../Controllers/ProductDescriptionsController');
const ChatBotUsers_Products = require('../Controllers/ChatBotUsers_ProductsController');
const Score = require('../Controllers/ScoresController');
const UserVisits = require('../Controllers/UserVisitsController');
const ResponseConstructor = require('../Utils/responseConstructors');
const Orders = require('../Controllers/OrdersController');
const Products_Orders = require("../Controllers/Products_OrdersController");
const DialogFlow = require("../dialogflow");

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
            await ChatBotUsers.saveUserData(sender);
            UserVisits.saveUserVisit(sender);
            handleMessages(messages, sender);
            break;
        case "Promociones.action":
            let promotions = await Promotions.getPromotions();
            for (let index = 0; index < promotions.length; index++) {
                const element = promotions[index];
                await sendTextMessage(sender, element.description);
                await sendImageMessage(sender, element.picture);
            }
            break;
        case "PrendasOPersonalizados.action":
            await Orders.createShoppingCart(sender);
            handleMessages(messages, sender);
            break;
        case "FallbackArtista.action":
            let artists = await Artists.getArtistsInText();
            sendTextMessage(sender, artists);
            break;
        case "ArtistaPrendaEspecifica.action":
            sendTextMessage(sender, "tenemos disponibles las siguientes prendas de " + parameters.fields.NombreDeArtista.stringValue);
            let product = await Products.getProductsByArtistName(parameters.fields.NombreDeArtista.stringValue);
            let cards = await ResponseConstructor.carrouselConstructor(product);
            sendGenericMessage(sender, cards);
            break;
        case "ArtistaPrendaYTalla.action":
            var size = parameters.fields.Talla.stringValue;
            var productName = parameters.fields.NombreDePrenda.stringValue;
            var productType = parameters.fields.Prenda.stringValue;
            var quantity = parameters.fields.Cantidad.numberValue;
            if (size == '' || productName == '' || productType == '' || !quantity) {
                handleMessages(messages, sender);
                break;
            }
            ChatBotUsers_Products.saveUserInterest(sender, productName, productType);
            const res = await ProductDescriptions.sizeExist(size, productName, productType, quantity);
            sendTextMessage(sender, res);
            break;
        case "IntencionDeCompra.action":
            var size = contexts[0].parameters.fields.Talla.stringValue;
            var productName = contexts[0].parameters.fields.NombreDePrenda.stringValue;
            var productType = contexts[0].parameters.fields.Prenda.stringValue;
            var quantity = contexts[0].parameters.fields.Cantidad.numberValue;
            await Products_Orders.createProductsOrders(sender, productName, productType, quantity, size);
            handleMessages(messages, sender);
            break;
        case "CarritoDeCompras.action":
            var productName = parameters.fields.NombreDePrenda.stringValue;
            var productType = parameters.fields.Prenda.stringValue;
            if (productName != '' && productType != '') {
                await Products_Orders.deleteProductOrders(sender, productName, productType);
            }
            const listShoppingCart = await Products_Orders.getListShoppingCart(sender);
            sendTextMessage(sender, listShoppingCart);
            break;
        case "PedirDatosDelCliente.action": 
            var data = await ChatBotUsers.haveData(sender);
            console.log(data);
            if (data != "") { 
                let res = await DialogFlow.sendToDialogFlow(
                    data,
                    sender,
                    "FACEBOOK",
                )
                handleDialogFlowResponse(sender, res);
                return;
            }
            handleMessages(messages, sender);
            break;
        case "DatosRecibidos.action":
            if (parameters.fields.phoneNumber.stringValue != '' && parameters.fields.email.stringValue != '') {
                await ChatBotUsers.updateData(sender, parameters.fields.phoneNumber.stringValue, parameters.fields.email.stringValue);
            }
            handleMessages(messages, sender);
            break;
        case "PuntuacionFinal.action":
            Score.saveScore(sender, parameters.fields.number.numberValue);
            handleMessages(messages, sender);
            break;
        default:
            //unhandled action, just send back the tex
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

async function handleCardMessages(messages, sender) {
    let elements = [];
    for (let m = 0; m < messages.length; m++) {
        let message = messages[m];
        let buttons = [];
        for (let b = 0; b < message.card.buttons.length; b++) {
            let isLink = message.card.buttons[b].postback.substring(0, 4) === "http";
            let button;
            if (isLink) {
                button = {
                    type: "web_url",
                    title: message.card.buttons[b].text,
                    url: message.card.buttons[b].postback,
                };
            } else {
                button = {
                    type: "postback",
                    title: message.card.buttons[b].text,
                    payload:
                        message.card.buttons[b].postback === ""
                            ? message.card.buttons[b].text
                            : message.card.buttons[b].postback,
                };
            }
            buttons.push(button);
        }

        let element = {
            title: message.card.title,
            image_url: message.card.imageUri,
            subtitle: message.card.subtitle,
            buttons,
        };
        elements.push(element);
    }
    await sendGenericMessage(sender, elements);
}

async function handleMessages(messages, sender) {
    try {
        let i = 0;
        let cards = [];
        while (i < messages.length) {
            switch (messages[i].message) {
                case "card":
                    for (let j = i; j < messages.length; j++) {
                        if (messages[j].message === "card") {
                            cards.push(messages[j]);
                            i += 1;
                        } else j = 9999;
                    }
                    await handleCardMessages(cards, sender);
                    cards = [];
                    break;
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

async function sendGenericMessage(recipientId, elements) {
    var messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements,
                },
            },
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
    sendTextMessage,
}