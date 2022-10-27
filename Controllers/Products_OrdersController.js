import Products_Orders from '../Models/Product_Orders';
import Product from '../Models/Products';

//devuelve todos los productos que pidio, y cuantas veces pidio ese producto un usuario
async function getProductsOrdered(chatBotUserId){
    let productsOrdered = await Products_Orders.aggregate(
        [
            {
                $match:{
                    chatBotUserId
                }
            },
            {
                $group:{
                    _id: '$productId',
                    timesGetProduct: {
                        $count: {}
                    }
                }
            }
        ]
    );
    let products = await Product.find();
    
    return replaceIdByName(productsOrdered, products);
}

function replaceIdByName(array1, array2){
    let result = [];
    for (let i = 0; i < array1.length; i++) {
        const elementI = array1[i];
        for (let j = 0; j < array2.length; j++) {
            const elementJ = array2[j];
            if (elementI._id == elementJ._id) {
                result.push({
                    name:elementJ.name,
                    timesGetProduct:elementI.timesGetProduct
                });
                break;
            }
        }
    }
    return result;
}

export default {
    getProductsOrdered,
}
