const ChatBotUser = require("../Models/ChatbotUsers");
const UserVisit = require("../Models/UserVisits");

async function saveUserVisit(facebookId) {
    let chatBotUser = await ChatBotUser.findOne({ facebookId });
    let userVisit = new UserVisit({
        chatBotUserId: chatBotUser._id,
    });
    userVisit.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un userVisit: ", res);
    });
}

async function getTimesVisited() {
    let userVisit = await UserVisit.aggregate([
        {
            $match:{
                state: 1
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
                timesVisited: {
                    $count: {}
                },
                lastUserVisit: {
                    $first: "$createdAt"
                }
            }
        },
        {
            $lookup: {
                from: "chatbotusers",
                localField: "_id",
                foreignField: "_id",
                as: "chatbotuser"
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
                                    ["$chatbotuser", 0]
                            }, "$$ROOT"]
                }
            }
        },
        {
            $project:
                { chatbotuser: 0 }
        }
    ])
    return userVisit;
}
// let getTimesVisited = async (req, res) => {
//     var data = req.query;
//     let timesVisited = (await UserVisit.find({ chatBotUserId: data._id })).length
//     res.json(timesVisited);
// }

let getLastVisit = async (req, res) => {
    var data = req.query;
    let lastUserVisit = await UserVisit.findOne({ chatBotUserId: data._id }).sort('-createdAt');
    console.log(lastUserVisit);
    res.json(lastUserVisit);
}
// async function getLastVisit(chatBotUserId){
//     let lastUserVisit = await UserVisit.findOne({chatBotUserId}).sort('-createdAt')
//     return lastUserVisit.createdAt;
// }

module.exports = {
    saveUserVisit,
    getTimesVisited,
    getLastVisit
}