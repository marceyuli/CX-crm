var express = require("express");
const ChatBotController = require("./Controllers/ChatBotController");
const HomePageController = require("./Controllers/HomePageController");
const ChatBotUsersController = require("./Controllers/ChatBotUsersController");
const Messages = require("./Controllers/MessagesController");
const TalkDetails = require("./Controllers/TalkDetailsController");
const Products = require("./Controllers/ProductController");
const Promotions = require("./Controllers/PromotionController");
const Accounts = require("./Controllers/AccountsController");

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", HomePageController.getHomepage);
    router.get("/webhook", ChatBotController.getWebhook);
    router.post("/webhook", ChatBotController.postWebhook);
    router.get("/getusersdata", ChatBotUsersController.getUsersData);
    router.post("/getactiveclientdata", ChatBotUsersController.getActiveClientData);
    router.post("/getmessages", Messages.getMessages);
    router.post("/gettalkdetails", TalkDetails.getTalkDetails);
    router.post("/savetalkdetail", TalkDetails.saveTalkDetails);
    router.post("/savemessage", Messages.saveMessage);
    router.get("/getproducts", Products.getProduct);
    router.post("/savepromotion", Promotions.savePromotion);
    router.post("/login", Accounts.login);
    router.get("/gethabitualusers", ChatBotUsersController.getHabitualUsers);
    router.get("/loginfb", Promotions.loginFB);
    router.get("/getlastpromotion", Promotions.getLastPromotion);

    return app.use("/", router);
};

module.exports = initWebRoutes;