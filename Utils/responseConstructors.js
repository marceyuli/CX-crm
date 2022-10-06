const Product = require('../Controllers/ProductController');
async function carrouselConstructor(products) {
    let cards = [];
    products.forEach(async (product) => {
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
    });
    return cards;
}

module.exports = {
    carrouselConstructor
}