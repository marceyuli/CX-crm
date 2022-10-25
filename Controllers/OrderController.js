import Order from '../Models/Orders';


async function getTimesOrdered(chatBotUserId) {
    return (await Order.find({ chatBotUserId })).length
}

async function getLastOrder(chatBotUserId) {
    let lastOrder = await TalkDetail.findOne({ chatBotUserId, order: true }).sort('-createdAt')
    return lastOrder.createdAt;
}

async function getAvgTotalPrice(chatBotUserId) {
    let order = await Order.aggregate(
        [
            { $match: { chatBotUserId } },
            {
                $group: {
                    _id: "$chatBotUserId",
                    avgTotalPrice: "$totalPrice",
                }
            }
        ]
    )
    return order;
}

export default {
    getTimesOrdered,
    getLastOrder,
}