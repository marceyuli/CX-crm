const Order = require('../Models/Orders');
const ChatBotUsers = require('../Models/ChatbotUsers');

async function createShoppingCart(facebookId) {
    let chatBotUser = await ChatBotUsers.findOne({ facebookId });
    let order = await Order.findOne({ chatBotUserId: chatBotUser._id, order: false });
    if (order) {
        return;
    }
    let shoppingCart = new Order({
        totalPrice: 0,
        chatBotUserId: chatBotUser._id,
        order: false
    })
    shoppingCart.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un carrito de compras: ", res);
    })
}
//devuelve a los clientes activos (state = 3) junto con la fecha de su ultimo pedido, y todas las ordenes que hizo
async function getTimesOrderedLastOrder() {
    return await ChatBotUsers.aggregate([
        {
            $match: {
                state: 3
            }
        },
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "chatBotUserId",
                pipeline: [
                    {
                        $match: {
                            order: true
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $group: {
                            _id: '$chatBotUserId',
                            timesOrdered: {
                                $count: {}
                            },
                            lastUserOrder: {
                                $first: "$createdAt"
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalPrice: 0,
                            order: 0,
                        }
                    }
                ],
                as: "orders"
            },
        },
        {
            $replaceRoot: {
                newRoot:
                {
                    $mergeObjects:
                        [
                            {
                                $arrayElemAt:
                                    ["$orders", 0]
                            }, "$$ROOT"]
                }
            },
        },
        {
            $project:
                { orders: 0 }
        }
    ])
}

//Devuelve a todos los clientes habituales(state = 4) junto con la ultima orden que hizo
//con su promedio de compras y con la frecuencia de pedidos
async function getAvgTotalPriceCreatedAt() {
    return await ChatBotUsers.aggregate([
        {
            $match: {
                state: 4
            }
        },
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "chatBotUserId",
                pipeline: [
                    {
                        $match: {
                            order: true
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $group: {
                            _id: '$chatBotUserId',
                            avgTotalPrice: {
                                $avg: "$totalPrice"
                            },
                            lastOrder: {
                                $first: "$createdAt"
                            },
                            firstOrder: {
                                $last: "$createdAt"
                            },
                            timesOrdered: {
                                $count: {}
                            }
                        }
                    },
                    {
                        $project: {
                            avgTotalPrice: 1,
                            lastOrder: 1,
                            frequencyOrder: {
                                $divide: [
                                    {
                                        $subtract: [new Date(), "$firstOrder"]
                                    },
                                    {
                                        $subtract: ["$timesOrdered", 1]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "orders"
            },
        },
        {
            $replaceRoot: {
                newRoot:
                {
                    $mergeObjects:
                        [
                            {
                                $arrayElemAt:
                                    ["$orders", 0]
                            }, "$$ROOT"]
                }
            },
        },
        {
            $project:
                { orders: 0 }
        }
    ])
}
module.exports = {
    getTimesOrderedLastOrder,
    getAvgTotalPriceCreatedAt,
    createShoppingCart,
}