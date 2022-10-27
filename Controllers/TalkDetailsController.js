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
        console.log("Se creo un TalkDetail: ", res);
    })
}

//devuelve la ultima fecha en la que fue contactado un usuario
async function getLastContact(chatBotUserId){
    let lastContact = await TalkDetail.findOne({chatBotUserId}).sort('-createdAt')
    return lastContact.createdAt;
}


//devuelve la cantidad de veces que fue contactado un usario
async function getTimesContacted(){
    return (await TalkDetail.find({chatBotUserId})).length;
}

//devuelve todos los detalles de las todas las veces que fue contactado un usuario
async function getTalkDetails(chatBotUserId){
    return await TalkDetail.find({chatBotUserId});
}

export default {
    saveTalkDetail,
    getLastContact,
    getTimesContacted,
    getTalkDetails
}