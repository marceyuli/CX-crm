import express from "express";
import ChatBotController from "./Controllers/ChatBotController";
import HomePageController from "./Controllers/HomePageController";

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", HomePageController.getHomepage);
    router.get("/webhook", ChatBotController.getWebhook);
    router.post("/webhook", ChatBotController.postWebhook);

    return app.use("/", router);
};

module.exports = initWebRoutes;