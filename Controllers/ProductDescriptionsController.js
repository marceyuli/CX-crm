const Product = require('../Controllers/ProductController');
const Promotion = require('../Models/Promotions');
const ProductDescriptions = require('../Models/ProductDescriptions');

//verifica si existe la talla y devuelve un texto
async function sizeExist(size, productName, productType, quantity) {
    try {
        let product = await Product.getProductByNameAndType(productName, productType);
        let productDescription = await ProductDescriptions.findOne({ productId: product._id, size });
        if (productDescription) {
            let res = "Ha seleccionado " + quantity + " prenda/s " + productName + " de talla " +
                size + " con un costo de: " + quantity * product.price + "Bs en total" + "\nDesea continuar con el pedido?"
            return res;
        }
    } catch (error) {
        return "no pude entenderlo, podria repetir lo que dijo?";
    }
    return "No tenemos disponible la talla en esa prenda por el momento. ¿Desea pedir otra prenda?"
}

module.exports = {
    sizeExist
}