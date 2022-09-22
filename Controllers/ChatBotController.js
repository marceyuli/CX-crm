//files
const dialogflow = require("../dialogflow");
const chatBotService = require("../Services/ChatBotService");
const config = require("../config");
const sessionIds = new Map();

if (!config.PAGE_ACCESS_TOKEN) {
    throw new Error("missing PAGE_ACCESS_TOKEN");
}
if (!config.VERIFICATION_TOKEN) {
    throw new Error("missing VERIFICATION_TOKEN");
}
if (!config.GOOGLE_PROJECT_ID) {
    throw new Error("missing GOOGLE_PROJECT_ID");
}
if (!config.DF_LANGUAGE_CODE) {
    throw new Error("missing DF_LANGUAGE_CODE");
}
if (!config.GOOGLE_CLIENT_EMAIL) {
    throw new Error("missing GOOGLE_CLIENT_EMAIL");
}
if (!config.GOOGLE_PRIVATE_KEY) {
    throw new Error("missing GOOGLE_PRIVATE_KEY");
}
if (!config.FB_APP_SECRET) {
    throw new Error("missing FB_APP_SECRET");
}

let postWebhook = (req, res) => {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == "page") {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else {
                    console.log(
                        "Webhook received unknown messagingEvent: ",
                        messagingEvent
                    );
                }
            });
        });

        // Assume all went well.
        // You must send back a 200, within 20 seconds
        res.sendStatus(200);
    }
};

let getWebhook = (req, res) => {
    if (
        req.query["hub.mode"] === "subscribe" &&
        req.query["hub.verify_token"] === config.VERIFICATION_TOKEN
    ) {
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
};

async function receivedMessage(event) {
    var senderId = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    console.log(
        "Received message for user %d and page %d at %d with message:",
        senderId,
        recipientID,
        timeOfMessage
    );

    var messageText = message.text;

    chatBotService.saveUserData(senderId);

    if (messageText) {
        //send message to dialogflow
        console.log("MENSAJE DEL USUARIO: ", messageText);
        await sendToDialogFlow(senderId, messageText);
    }
}


async function sendToDialogFlow(senderId, messageText) {
    chatBotService.sendTypingOn(senderId);
    try {
        let result;
        chatBotService.setSessionAndUser(senderId);
        let session = sessionIds.get(senderId);
        result = await dialogflow.sendToDialogFlow(
            messageText,
            session,
            "FACEBOOK"
        );
        chatBotService.handleDialogFlowResponse(senderId, result);
    } catch (error) {
        console.log("salio mal en sendToDialogflow...", error);
    }
}



module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
};