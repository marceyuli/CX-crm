async function carrouselConstructor(products) {
    let cards = [];
    products.forEach((product) => {
        cards.push({
            title: product.name + " $" + product.price,
            image_url: product.picture,
            buttons: [
                {
                    type: "postback",
                    title: {text:"Hacer compra", value:product.name},
                    payload: "hacer_compra",
                    data: product.name,
                },
            ],
        });
    });
    return cards;
}

module.exports = {
    carrouselConstructor
}