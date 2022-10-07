const Product = require('../Controllers/ProductController');
async function carrouselConstructor(products) {
    let cards = [];
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        let price = await Product.getPrice(product);
        cards.push({
            title: product.name + " $" + price,
            image_url: product.picture,
            buttons: [
                {
                    type: "postback",
                    title: "Hacer compra",
                    payload: product.type + " " + product.name,
                },
            ],
        });
    }
    return cards;
}

async function carrouselPromotions(promotions){
    let cards = [];
    for (let index = 0; index < promotions.length; index++) {
        const promotion = promotions[index];
        cards.push({
            title: "PROMOCION" ,
            image_url: promotion.picture,
            buttons: [
                {
                    type: "postback",
                    title: "Ir al Descuento",
                    payload: promotion.description,
                },
            ],
        });
    }
    return cards;
}

module.exports = {
    carrouselConstructor,
    carrouselPromotions
}