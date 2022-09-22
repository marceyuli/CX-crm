var express = require("express");
const ChatBotController = require("./Controllers/ChatBotController");
const HomePageController = require("./Controllers/HomePageController");

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", HomePageController.getHomepage);
    router.get("/webhook", ChatBotController.getWebhook);
    router.post("/webhook", ChatBotController.postWebhook);

    return app.use("/", router);
};

module.exports = initWebRoutes;