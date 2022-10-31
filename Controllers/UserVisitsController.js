const ChatBotUser = require("../Models/ChatbotUsers");
const UserVisit = require("../Models/UserVisits");

async function saveUserVisit(facebookId) {
    let chatBotUser = await ChatBotUser.findOne({ facebookId });
    let userVisit = new UserVisit({
        chatBotUserId: chatBotUser._id,
        phrases: []
    });
    userVisit.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo un userVisit: ", res);
    });
}


//Devuelve todos los usuarios que pertenezcan al prospecto (state=1) junto con la fecha de su ultima visita
//y las veces que hablo con el bot
async function getTimesVisitedLastVisit() {
    let userVisit = await UserVisit.aggregate([
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
            $match: {
                state: 1
            }
        },
        {
            $project:
                { chatbotuser: 0 }
        }
    ])
    return userVisit;
}

module.exports = {
    saveUserVisit,
    getTimesVisitedLastVisit,
}