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
                    value: product.name,
                    payload: "hacer_compra",
                },
            ],
        });
    });
    return cards;
}

module.exports = {
    carrouselConstructor
}