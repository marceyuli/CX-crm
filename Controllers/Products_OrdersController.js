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
    try {
        let chatBotUser = await ChatBotUsers.findOne({ facebookId });
        let shoppingCart = await getProductsOrders(chatBotUser);
        let res = "Actualmente tienes lo siguiente en tu carrito de compras:\n";
        shoppingCart.forEach(element => {
            const product_orders = element.product_orders;
            res += "-" + product_orders.quantity + " " + product_orders.type + " " + product_orders.name + " de talla " + product_orders.size +
                " con un precio de " + product_orders.price * product_orders.quantity + " Bs\n"
        });
        res += "Deseas quitar un producto, añadir o continuar con la compra?";
        return res;
    } catch (error) {
        console.log(error);
    }
}

async function getProductsOrders(chatBotUser){
    return await Order.aggregate([
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
            $project:{
                _id: 0,
                product_orders: 1
            }
        },
        {
            $unwind: "$product_orders"
        }
    ]);
}

async function getActiveClientData(chatBotUserId){
    return await Order.aggregate([
        {
            $match: {
                chatBotUserId,
                order: true
            }
        },
        {
            $lookup: {
                from: "products_orders",
                localField: "_id",
                foreignField: "orderId",
                pipeline: [
                    {
                        $group:{
                            productId:"$productId",
                            totalPrice:{$sum:"$price"},
                            size:"$size"
                        }
                    },
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
            $project:{
                _id: 0,
                product_orders: 1
            }
        },
        {
            $unwind: "$product_orders"
        }
    ]);
}

async function deleteProductOrders(facebookId, productName, productType) {
    let chatBotUser = await ChatBotUsers.findOne({ facebookId });
    let order = await Order.findOne({ chatBotUserId: chatBotUser._id, order: false });
    let product = await Product.getProductByNameAndType(productName, productType);
    await Product_Orders.findOneAndRemove({ productId: product._id, orderId: order._id });
}
module.exports = {
    createProductsOrders,
    getListShoppingCart,
    deleteProductOrders,
    getProductsOrders,
    getActiveClientData
}