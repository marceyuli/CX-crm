const Accounts = require('../Models/Accounts');

let login = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let isRegistered = await Accounts.findOne({ username: data.username, password: data.password });
        if (isRegistered) {
            res.json("ok");
        }
        res.json("contraseña incorrecta");
    } catch (error) {
        console.log(error);
    }
}

async function getAccount(username){
    return await Accounts.findOne({username});
}

module.exports = {
    login,
}