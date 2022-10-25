import TalkDetail from '../Models/TalkDetails';

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
        console.log("Se creo un usuario: ", res);
    })
}

async function getLastContact(chatBotUserId){
    let lastContact = await TalkDetail.findOne({chatBotUserId}).sort('-createdAt')
    return lastContact.createdAt;
}

async function getTimesContacted(){
    return (await TalkDetail.find({chatBotUserId})).length
}

export default {
    saveTalkDetail,
    getLastContact,
    getTimesContacted
}