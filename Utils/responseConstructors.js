async function carrouselConstructor(products) {
    let cards = [];
    products.forEach((product) => {
        cards.push({
            title: product.name + " $" + product.price,
            image_url: product.picture,
            buttons: [
                {
                    type: "postback",
                    title: "Hacer compra",
                    payload: product.type + product.name,
                },
            ],
        });
    });
    return cards;
}

module.exports = {
    carrouselConstructor
}