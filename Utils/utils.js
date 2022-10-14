const axios = require("axios");

async function getUserData(senderId) {
    console.log("consiguiendo datos del usuario...");
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        let userData = await axios.get(
            "https://graph.facebook.com/v14.0/" + "/me" + "?scope=email,first_name,profile_pic,link,name",
            {
                params: {
                    access_token,
                    // fields: 
                    // "email,first_name,last_name,profile_pic,link,name"
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