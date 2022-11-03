let Promotions_Products = require('../Models/Promotions_Products');
let Products = require('./ProductController');

async function createPromotionsProducts(productName, productType, promotion){
    let product = await Products.getProductByNameAndType(productName, productType);
    let promotion_product = new Promotions_Products({
        promotionId: promotion._id,
        productId: product._id
    })
    promotion_product.save((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Se creo una promocion ligada a un producto: ", res);
    })
}

module.exports = {
    createPromotionsProducts
}