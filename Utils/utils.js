const axios = require("axios");

async function getUserData(senderId) {
    console.log("consiguiendo datos del usuario...");
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        let userData = await axios.get(
            "https://graph.facebook.com/v15.0/"+ senderId
            //  + "?fields=id%2Cbirthday%2Clink%2Cemail%2Cfirst_name"
            ,
            {
                params: {
                    access_token:"EAAHASbZBT39sBAJH0yLEo7Y93nok01ZA9xlA6DOdcfEIDghAqy0cu6Fm7oMkbP1xaHYZC2RxudSpb5xjZA0WRZAvqMzZCrMQHuxEJQT1KNabiZBwe21qIUfiK0jUir3ztLbdoaxsEF4ubkGb5aZAgKZAosUfb00Ml1BvZC8skYSva4r8waT8mDDYWsigBFP5Wpat6cvU8JwRzixu6z0A1rpxkwTMYUXIMNZBAcZD",
                    fields: 
                    "first_name,last_name,profile_pic,link,birthday,gender,languages,email"
                },
                
                
            }
        );
        console.log(userData);
        return userData.data;
    } catch (err) {
        console.log("algo salio mal en axios getUserData: ", err);
        return {
            first_name: "",
            last_name: "",
            profile_pic: "",
        };
    }
}

module.exports = {
    getUserData,
}