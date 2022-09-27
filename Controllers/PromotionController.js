const Promotion = require('../Models/Promotions');

async function getPromotionsDescription() {
    let cursor = await Promotion.find();
    let promotions = "Las promociones disponibles son: ";
    cursor.forEach(element => {
        promotions += element.description + "\n";
    });
    return promotions;
}

module.exports = {
    getPromotionsDescription,
}