const ChatBotUsers_Products = require('../Models/ChatBotUsers_Products');
const Product = require('../Controllers/ProductController');
const ChatBotUser = require('../Models/ChatbotUsers');

async function saveUserInterest(facebookId, productName, productType) {
    let product = await Product.getProductByNameAndType(productName, productType);
    let chatBotUser = await ChatBotUser.findOne({ facebookId });
    let isRegistered = await ChatBotUsers_Products.findOne({
        productId: product._id,
        chatBotUserId: chatBotUser._id
    })
    if (isRegistered) {
        return;
    }
    let chatBotUsers_Products = new ChatBotUsers_Products({
        chatBotUserId: chatBotUser._id,
        productId: product._id,
    });
    chatBotUsers_Products.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un interes: ", res);
    })
}

module.exports = {
    saveUserInterest
}