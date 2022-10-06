const Promotion = require('../Models/Promotions');

async function getPromotions() {
    let cursor = await Promotion.find();
    return cursor;
}

module.exports = {
    getPromotions,
}