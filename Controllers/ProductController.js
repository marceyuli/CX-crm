const Product = require('../Models/Products');
const Artists = require('../Controllers/ArtistController');
const Promotion = require('../Models/Promotions');

//devuelve la lista de productos de un artista
async function getProductsByArtistName(artistName) {
    let artist = await Artists.getArtistByName(artistName);
    let result = await Product.find({ artistId: artist._id });
    // let products = "Los productos disponibles son: ";
    // result.forEach(element => {
    //     products += element.name + "\n";
    // });
    return result;
}

//devuelve 1 producto
async function getProductByNameAndType(productName, productType) {
    let result = await Product.findOne({ name: productName, type: productType });
    return result;
}

async function getPrice(product) {
    let promotion = Promotion.findOne({ _id: product.promotionId });
    let discount = 1;
    if (promotion) {
        discount = promotion.discount;
    }
    return product.price * discount;
}
module.exports = {
    getProductsByArtistName,
    getProductByNameAndType,
    getPrice
}