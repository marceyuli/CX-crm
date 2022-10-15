const axios = require("axios");

async function getUserData(senderId) {
    console.log("consiguiendo datos del usuario...");
    let access_token = process.env.PAGE_ACCESS_TOKEN;
    try {
        let userData = await axios.get(
            "https://graph.facebook.com/v15.0/me?fields=id%2Cname%2Cbirthday%2Clink%2Cemail&access_token=EAAHASbZBT39sBANuNhruXZBR2DFuNWnAU0SuyF2xOTyg6lzUANSvrmzGVujkXRh8cCmVDbVFeqtt300HKqSWosIZAezNGCJ9aTNAxlaaqpJ3KdsbnjL2s7fOmDkBjYkCiYcKOjrohhjyarmWg02h7fqcWP4oSyIltPDjgXtndPZBfQrHffXCQRm7RH1qIuUbQGFOLFELm7CzfVwYZAV5S"
            ,
            // {
            //     params: {
            //         access_token,
            //         fields: 
            //         "email,first_name,last_name,profile_pic,link,birthday,gender,languages"
            //     },
                
                
            // }
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