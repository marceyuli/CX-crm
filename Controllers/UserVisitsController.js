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
            $project: {
                _id: 1,
                timesVisited: 1,
                lastUserVisit: 1,
                firstName: "$chatbotuser.firstName",
                lastName: "$chatbotuser.lastName",
                facebookId: "$chatbotuser.facebookId",
                profilePicture: "$chatbotuser.profilePicture",
                email: "$chatbotuser.email",
                phoneNumber: "$chatbotuser.phoneNumber",
                state: "$chatbotuser.state",
            }
        },
        // { $unwind: "$firstName" },
        // { $unwind: "$lastName" },
        // { $unwind: "$facebookId" },
        // { $unwind: "$profilePicture" },
        // { $unwind: "$email" },
        // { $unwind: "$phoneNumber" },
        // { $unwind: "$state" }
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