var express = require("express");
const ChatBotController = require("./Controllers/ChatBotController");
const HomePageController = require("./Controllers/HomePageController");
const ChatBotUsersController = require("./Controllers/ChatBotUsersController");
const Messages = require("./Controllers/MessagesController");

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", HomePageController.getHomepage);
    router.get("/webhook", ChatBotController.getWebhook);
    router.post("/webhook", ChatBotController.postWebhook);
    router.get("/getusersdata", ChatBotUsersController.getUsersData);
    router.post("/getactiveclientdata", ChatBotUsersController.getActiveClientData);
    router.post("/getmessages", Messages.getMessages);
    return app.use("/", router);
};

module.exports = initWebRoutes;