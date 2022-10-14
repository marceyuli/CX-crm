const axios = require("axios");

async function getUserData(senderId) {
    console.log("consiguiendo datos del usuario...");
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        let userData = await axios.get(
            "https://graph.facebook.com/v14.0/" + senderId,
            {
                params: {
                    access_token,
                },
                "field": 
                    "email,first_name,last_name,profile_pic,link,name"
                
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