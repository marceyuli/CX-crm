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

//devuelve la ultima fecha en la que fue contactado un usuario
async function getLastContact(chatBotUserId) {
    let lastContact = await TalkDetail.findOne({ chatBotUserId }).sort('-createdAt')
    return lastContact.createdAt;
}

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
//devuelve la cantidad de veces que fue contactado un usario
// async function getTimesContacted(){
//     return (await TalkDetail.find({chatBotUserId})).length;
// }

//devuelve todos los detalles de las todas las veces que fue contactado un usuario
async function getTalkDetails(chatBotUserId) {
    return await TalkDetail.find({ chatBotUserId });
}

module.exports = {
    saveTalkDetail,
    getLastContact,
    getTimesContactedLastContact,
    getTalkDetails
}