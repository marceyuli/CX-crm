const Product = require('.../Models/Products');
 
async function getProductsByArtist( artist_idParam){
    let result = await Product.find(({artist_id}) => artist_id ===artist_idParam);
    let products = "Los productos disponibles son: ";
    result.array.forEach(element => {
        products += element.name + "\n";
    });
    return products;
}
async function getProductsByName( nameParam){
    let result = await Product.find(({name}) => name ===nameParam);
    
    return result;
}
module.exports = {
    getProductsByArtist,
    getProductsByName
}