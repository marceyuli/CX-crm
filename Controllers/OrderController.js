import Order from '../Models/Orders';

//devuelve la cantidad de veces que hizo una orden un usuario
async function getTimesOrdered(chatBotUserId) {
    return (await Order.find({ chatBotUserId, order: true })).length
}

//devuelve la ultima vez que hizo una orden un usuario
async function getLastOrder(chatBotUserId) {
    let lastOrder = await Order.findOne({ chatBotUserId, order: true }).sort('-createdAt')
    return lastOrder.createdAt;
}

//al recuperar los datos en la vista se debe hacer un Date.now()-avgCreatedAt, luego ese resultado
//convertirlo a dias Math.round(result/1000/60/60/24)
async function getAvgTotalPrice(chatBotUserId) {
    let order = await Order.aggregate(
        [
            {
                $match: {
                    chatBotUserId
                }
            },
            {
                $group: {
                    _id: "$chatBotUserId",
                    avgTotalPrice: {
                        $avg: "$totalPrice"
                    },
                    avgCreatedAt: {
                        $avg: "$createdAt"  //devuelve milisegundos
                    },
                }
            }
        ]
    )
    return order;
}

export default {
    getTimesOrdered,
    getLastOrder,
    getAvgTotalPrice
}