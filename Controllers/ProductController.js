const Product = require('../Models/Products');
const Artists = require('../Controllers/ArtistController');

//devuelve la lista de productos de un artista
async function getProductsByArtistName(artistName) {
    let artist = await Artists.getArtist(artistName);
    console.log(artist);
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
module.exports = {
    getProductsByArtistName,
    getProductByNameAndType
}