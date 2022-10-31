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
// se fue la luz en todo el barrio, prende las velas que esta fiesta no se apaga
async function getListShoppingCart(facebookId) {
    let chatBotUser = await ChatBotUsers.findOne({ facebookId });
    let shoppingCart = await Order.aggregate([
        {
            $match: {
                chatBotUserId: chatBotUser._id,
                order: false
            }
        },
        {
            $lookup: {
                from: "products_orders",
                localField: "_id",
                foreignField: "orderId",
                pipeline: [
                    {
                        $lookup: {
                            from: "products",
                            localField: "productId",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        name: 1,
                                        type: 1,
                                        picture: 0,
                                        price: 0,
                                        artistId: 0
                                    }
                                },
                            ],
                            as: "product",
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot:
                            {
                                $mergeObjects:
                                    [
                                        {
                                            $arrayElemAt:
                                                ["$product", 0]
                                        }, "$$ROOT"]
                            }
                        },
                    },
                    {
                        $project:
                            { product: 0 }
                    }
                ],
                as: "product_orders"
            }
        },
        {
            $unwind: "$product_orders"
        }
    ]);
    let res = "Actualmente tienes lo siguiente en tu carrito de compras:\n";
    shoppingCart.forEach(element => {
        res += "-" + element.quantity + " " + element.type + " "  + element.name + " de talla " + element.size + 
        " con un precio de " + element.price * element.quantity + " Bs\n" 
    });
    res += "Deseas quitar un producto, añadir o continuar con la compra?";
    return res;
}

module.exports = {
    createProductsOrders,
    getListShoppingCart,
}