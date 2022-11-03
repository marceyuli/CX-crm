

//libraries
const Artists = require('../Controllers/ArtistController');

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
const SendToDialogFlow = require('./SendToDialogFlow');

function handleDialogFlowResponse(sender, response, session) {
    let responseText = response.fulfillmentText;
    let messages = response.fulfillmentMessages;
    let action = response.action;
    let contexts = response.outputContexts;
    let parameters = response.parameters;
    SendToDialogFlow.sendTypingOff(sender);

    if (isDefined(action)) {
        handleDialogFlowAction(sender, action, messages, contexts, parameters, session);
    } else if (isDefined(messages)) {
        handleMessages(messages, sender);
    } else if (responseText == "" && !isDefined(action)) {
        //dialogflow could not evaluate input.
        SendToDialogFlow.sendTextMessage(sender, "No entiendo lo que trataste de decir ...");
    } else if (isDefined(responseText)) {
        SendToDialogFlow.sendTextMessage(sender, responseText);
    }
}


async function handleDialogFlowAction(
    sender,
    action,
    messages,
    contexts,
    parameters,
    session
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
                await SendToDialogFlow.sendTextMessage(sender, element.description);
                await SendToDialogFlow.sendImageMessage(sender, element.picture);
            }
            break;
        case "PrendasOPersonalizados.action":
            await Orders.createShoppingCart(sender);
            handleMessages(messages, sender);
            break;
        case "FallbackArtista.action":
            let artists = await Artists.getArtistsInText();
            SendToDialogFlow.sendTextMessage(sender, artists);
            break;
        case "ArtistaPrendaEspecifica.action":
            SendToDialogFlow.sendTextMessage(sender, "tenemos disponibles las siguientes prendas de " + parameters.fields.NombreDeArtista.stringValue);
            let product = await Products.getProductsByArtistName(parameters.fields.NombreDeArtista.stringValue);
            let cards = await ResponseConstructor.carrouselConstructor(product);
            SendToDialogFlow.sendGenericMessage(sender, cards);
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
            SendToDialogFlow.sendTextMessage(sender, res);
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
            SendToDialogFlow.sendTextMessage(sender, listShoppingCart);
            break;
        case "PedirDatosDelCliente.action":
            var data = await ChatBotUsers.haveData(sender);
            if (data != "") {
                let res = await DialogFlow.sendToDialogFlow(
                    data,
                    session,
                    "FACEBOOK",
                )
                handleDialogFlowResponse(sender, res, session);
                return;
            }
            handleMessages(messages, sender);
            break;
        case "DatosRecibidos.action":
            if (parameters.fields.phoneNumber.stringValue != '' && parameters.fields.email.stringValue != '') {
                await ChatBotUsers.updateData(sender, parameters.fields.phoneNumber.stringValue, parameters.fields.email.stringValue);
                await Orders.updateToOrder(sender);
            }
            handleMessages(messages, sender);
            break;
        case "PuntuacionFinal.action":
            Score.saveScore(sender, parameters.fields.number.numberValue);
            handleMessages(messages, sender);
            break;
        case "pedirDatosDeComunicacionAFuturo.action":
            if (parameters.fields.phoneNumber.stringValue != '' && parameters.fields.email.stringValue != '') {
                await ChatBotUsers.updateData(sender, parameters.fields.phoneNumber.stringValue, parameters.fields.email.stringValue);
            }
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
                    await SendToDialogFlow.sendTextMessage(sender, text);
                }
            }
            break;
        case "image":
            await SendToDialogFlow.sendImageMessage(sender, message.image.imageUri);
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
            await SendToDialogFlow.sendQuickReply(sender, message.quickReplies.title, replies);
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
    await SendToDialogFlow.sendGenericMessage(sender, elements);
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
}