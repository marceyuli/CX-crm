const TalkDetails = require('../Models/TalkDetails');
const ChatbotUsers = require('../Models/ChatbotUsers');

async function saveTalkDetail(content, socialMedia, chatBotUserId) {
    let talkDetail = new TalkDetails({
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

let getTalkDetails = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let chatBotUser = await ChatbotUsers.findOne({ facebookId: data.facebookId});
        let talkdetails = await TalkDetails.find({chatBotUserId:chatBotUser._id});
        console.log(talkdetails);
        res.json(talkdetails);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    saveTalkDetail,
    getTimesContactedLastContact,
    getTalkDetails
}