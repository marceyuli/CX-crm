const Product_Orders = require('../Models/Products_Orders');
const Order = require('../Models/Orders');
const ChatBotUsers = require('../Models/ChatbotUsers');
const Product = require('../Controllers/ProductController');

async function createProductsOrders(facebookId, productName, productType, quantity, size) {
    let chatBotUser = await ChatBotUsers.findOne({ facebookId });
    let order = await Order.findOne({ chatBotUserId: chatBotUser._id, order: false });
    let product = await Product.getProductByNameAndType(productName, productType);

    let products_Orders = new Product_Orders({
        price: product.price,
        quantity,
        size,
        orderId: order._id,
        productId: product._id,
    })
    products_Orders.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un product order: ", res);
    })
}

async function getListShoppingCart(facebookId) {
    let chatBotUser = await ChatBotUsers.findOne({ facebookId });
}

module.exports = {
    createProductsOrders,
    getListShoppingCart,
}