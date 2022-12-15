const Promotions = require('../Models/Promotions');
const Promotions_Products = require('./Promotions_ProductsController');
const Messages = require('./MessagesController');
const ChatBotUsers = require('./ChatBotUsersController');
const SendGridService = require('../Services/SendGridService');
const axios = require("axios");

//devuelve todas las promociones
async function getPromotions() {
    let cursor = await Promotions.find();
    return cursor;
}

let getLastPromotionJson = async (req, res) => {
    try {
        let lastPromotion = await Promotions.findOne().sort({ createdAt: -1 });
        res.json(lastPromotion);
    } catch (error) {
        console.log(error);
    }
}

async function getLastPromotion() {
    return await Promotions.findOne().sort({ createdAt: -1 });
}

//crea una promocion y la devuelve
async function createPromotion(description, picture, discount) {
    let promotion = new Promotions({
        description,
        picture,
        discount
    })
    promotion.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo una Promocion: ", res);
    })
    return promotion;
}

//conecta con api, guarda una promocion, se le asigna a todos los productos y envia mensaje a todos los
//clientes habituales
let savePromotion = async (req, res) => {
    try {
        let data = req.body
        let products = data.products;
        let discount = parseInt(data.discount);
        discount = discount / 100;
        postFacebook(data.description, data.picture);
        let promotion = await createPromotion(data.description, data.picture, discount);
        for (let j = 0; j < products.length; j++) {
            const element = products[j];
            Promotions_Products.createPromotionsProducts(element.productName, element.productType, promotion);
        }
        let habitualClients = await ChatBotUsers.getChatBotUserByState(4);
        for (let i = 0; i < habitualClients.length; i++) {
            const element = habitualClients[i];
            Messages.saveAndSendMessage(element.facebookId, data.description, data.picture);
        }
        sendEmails(habitualClients, promotion);
        res.json("ok");
    } catch (error) {
        console.log(error);
    }
}

let loginFB = async (req, res) => {
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        axios.post("https://graph.facebook.com/v14.0/103634212481456/photos?", {
            message: ":D",
            url: "https://www.metroworldnews.com/resizer/rBF6nDTfcpfdMnxY_ku21Xkn3bY=/800x0/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/E7V4NSIU55BB3KBUNJFGRZWBQE.jpg",
            access_token
        }).then(
            res => {
                const result = res.data;
                console.log(result);
                console.log("Exito")
            },
            error => {
                console.log(error);
            }
        )
    } catch (error) {
        console.log(error);
    }
}

async function postFacebook(message, url){
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        axios.post("https://graph.facebook.com/v14.0/103634212481456/photos?", {
            message,
            url,
            access_token
        }).then(
            res => {
                const result = res.data;
                console.log(result);
                console.log("Exito")
            },
            error => {
                console.log(error);
            }
        )
    } catch (error) {
        console.log(error);
    }
}

async function sendEmails(habitualUsers, lastPromotion){
    SendGridService.sendEmails(habitualUsers, lastPromotion);
}

module.exports = {
    getPromotions,
    createPromotion,
    savePromotion,
    loginFB,
    getLastPromotionJson,
    getLastPromotion
}