const Promotions = require('../Models/Promotions');
const Promotions_Products = require('./Promotions_ProductsController');
const Messages = require('./MessagesController');
const ChatBotUsers = require('./ChatBotUsersController');

//devuelve todas las promociones
async function getPromotions() {
    let cursor = await Promotions.find();
    return cursor;
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
//clientes activos
let savePromotion = async (req, res) => {
    try {
        let data = req.body
        let products = data.products;
        let discount = parseInt(data.discount)
        discount = discount / 100;
        let promotion = await createPromotion(data.description, data.picture, discount);
        for (let j = 0; j < products.length; j++) {
            const element = products[j];
            Promotions_Products.createPromotionsProducts(element.productName, element.productType, promotion);
        }
        let activeClients = await ChatBotUsers.getChatBotUserByState(4);
        for (let i = 0; i < activeClients.length; i++) {
            const element = activeClients[i];
            Messages.saveAndSendMessage(element.facebookId, data.description, data.picture);
        }
        res.json("ok");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getPromotions,
    createPromotion,
    savePromotion
}