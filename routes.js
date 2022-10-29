var express = require("express");
const ChatBotController = require("./Controllers/ChatBotController");
const HomePageController = require("./Controllers/HomePageController");
const ChatBotUsersController = require("./Controllers/ChatBotUsersController");
const UserVisitsController = require("./Controllers/UserVisitsController");

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", HomePageController.getHomepage);
    router.get("/webhook", ChatBotController.getWebhook);
    router.post("/webhook", ChatBotController.postWebhook);
    router.get("/getusersdata", ChatBotUsersController.getUsersData);
    router.get("/getusertimesvisited", UserVisitsController.getTimesVisited);
    router.get("/getuserlastvisit", UserVisitsController.getLastVisit);
    return app.use("/", router);
};

module.exports = initWebRoutes;