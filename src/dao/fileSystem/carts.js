import { cartsModel } from "../../models/carts.js";


export default class Carts {

    getCart = async (idCart) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart }).lean();
            return cart;
        } catch (error) {
            throw error;
        }
    }
    
    createCart = async () => {
        try {
            const result = await cartsModel.create({});
            return result;
        } catch (error) {
            throw error;
        }
    }

    upgrateCart = async (idCart, idProduct) => {
        try {
            const cart = await cartsModel.findById(idCart);
            const productoExistente = cart.products.find(producto => producto.product.equals(idProduct));

            if (productoExistente) {
                await cartsModel.updateOne(
                    {
                        _id: idCart,
                        "products.product": idProduct
                    },
                    { $inc: { "products.$.quantity": 1 } }
                );
            } else {
                await cartsModel.updateOne({ _id: idCart },
                    {
                        $push: {
                            products: { product: idProduct, quantity: 1 }
                        }
                    });
            }

            const result = await cartsModel.findOne({ _id: idCart });
            return result;
        } catch (error) {
            throw error;
        }
    }

    upgrateCartByBody = async (idCart, products) => {
        try {
            await cartsModel.updateOne({ _id: idCart },
                {
                    $push: { products: products }
                });
            const result = await cartsModel.findOne({ _id: idCart });
            return result;
        } catch (error) {
            throw error;
        }
    }

    updateQuantityProducts = async (idCart, idProduct, quantity) => {
        try {
            await cartsModel.findOneAndUpdate(
                { _id: idCart, 'products.product': idProduct  },
                { $set: { 'products.$.quantity': quantity } }
            );
            const result = await cartsModel.findOne({ _id: idCart });
            return result;
        } catch (error) {
            throw error
        }
    }

    deleteCart = async (idCart) => {
        try {
            const result = await cartsModel.findByIdAndUpdate(
                idCart,
                { $set: { products: [] } }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    deleteProductToCart = async (idCart, idProduct) => {
        try {
            await cartsModel.findByIdAndUpdate(
                idCart,
                { $pull: { products: { product: idProduct } } },
            )
            const result = await cartsModel.findOne({ _id: idCart });
            return result;
        } catch (error) {
            throw error
        }
    }

}