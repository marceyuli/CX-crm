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

async function carrouselUbications() {
    let cards = [];
    cards.push({
        title: "Ubicaciones",
        subtitle: "holaaa",
        image_url: "https://scontent.flpb4-1.fna.fbcdn.net/v/t39.30808-6/306845306_112475144937344_5241930679119958838_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Ljccq8qWl-EAX9kEkj4&_nc_oc=AQmSFm0MORvmj4DU04KR0alD3jSVnUf51qWACNm08WtEyTHAgBx056_2ELHr7w1415M&_nc_ht=scontent.flpb4-1.fna&oh=00_AT907Kc7bfO1f1axmAxQ6FDXpR4MX0dL6jMu0F-4FXU8CQ&oe=63462231",
        buttons: [
            {
                type: "postback",
                title: "direccion 1",
                payload: "www.facebook.com",
            },
            {
                type: "postback",
                title: "direccion 2",
                payload: "www.youtube.com",
            },
            {
                type: "postback",
                title: "direccion 3",
                payload: "www.twitch.com",
            },
        ],
    });
    return cards;
}

module.exports = {
    carrouselConstructor,
    carrouselUbications,
}