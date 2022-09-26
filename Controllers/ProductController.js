const Product = require('.../Models/Products');
 
async function getProductsByArtist( artist_idParam){
    let result = await Product.find(({artist_id}) => artist_id ===artist_idParam);
    let products = "Los productos disponibles son: ";
    result.array.forEach(element => {
        products += element.name + "\n";
    });
    return products;
}

module.exports = {
    getProductsByArtist,
}