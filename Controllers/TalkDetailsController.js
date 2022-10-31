const TalkDetail = require('../Models/TalkDetails');
const ChatbotUsers = require('../Models/ChatbotUsers');

async function saveTalkDetail(content, socialMedia, chatBotUserId) {
    let talkDetail = new TalkDetail({
        content,
        socialMedia,
        chatBotUserId
    })
    talkDetail.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un TalkDetail: ", res);
    })
}

//devuelve a los clientes contactados (state = 2) junto con la cantidad de veces que fueron contactados
//y con la ultima fecha de su contacto
async function getTimesContactedLastContact() {
    let talkDetail = await ChatbotUsers.aggregate([
        {
            $match: {
                state: 2
            }
        },
        {
            $lookup: {
                from: "talkdetails",
                localField: "_id",
                foreignField: "chatBotUserId",
                pipeline: [
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $group: {
                            _id: '$chatBotUserId',
                            timesContacted: {
                                $count: {}
                            },
                            lastUserContact: {
                                $first: "$createdAt"
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                        }
                    }
                ],
                as: "talkDetails"
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
                                    ["$talkDetails", 0]
                            }, "$$ROOT"]
                }
            },
        },
        {
            $project:
                { talkDetails: 0 }
        }
    ])
    return talkDetail;
}


module.exports = {
    saveTalkDetail,
    getTimesContactedLastContact,
}