const Product = require('../Controllers/ProductController');
const Promotion = require('../Models/Promotions');
const ProductDescriptions = require('../Models/ProductDescriptions');

//devuelve el precio de un producto
async function sizeExist(size, productName, productType){
    let product = await Product.getProductByNameAndType(productName, productType);
    let productDescription = await ProductDescriptions.findOne({productId: product._id, size});
    if (productDescription) {
        let res = "Ha seleccionado la siguiente prenda " + productName + " de talla " +
         size + "\nDesea continuar con el pedido?"
        return res;
    }
    return "No tenemos disponible la talla en esa prenda por el momento. ¿Desea pedir otra prenda?"
}

module.exports = {
    sizeExist
}