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
                    payload: { title: "hacer_compra", value: product.name },
                },
            ],
        });
    });
    return cards;
}

module.exports = {
    carrouselConstructor
}