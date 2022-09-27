const Product = require('../Controllers/ProductController');
const Promotion = require('../Models/Promotions');
const ProductDescriptions = require('../Models/ProductDescriptions');

//devuelve el precio de un producto
async function getPrice(size, productName, productType){
    let product = await Product.getProductByNameAndType(productName, productType);
    let productDescription = await ProductDescriptions.findOne({productId: product._id, size});
    if (productDescription) {
        let promotion = await Promotion.findOne({_id:product.promotionId});
        let res = "El precio es de: " + productDescription.price*promotion.discount;
        return res;
    }
    return "No tenemos disponible la talla en esa prenda por le momento. ¿Desea pedir otra prenda?"
}

module.exports = {
    getPrice
}