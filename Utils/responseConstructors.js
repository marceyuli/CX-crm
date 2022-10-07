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

module.exports = {
    carrouselConstructor,
}