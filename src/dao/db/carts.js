import mongoose from "mongoose";
import { cartsModel } from "../../models/carts.js";
import { productsModel } from "../../models/products.js";
import CustomError from "../../service/errors/CustomError.js";
import EErrors from "../../service/errors/enums.js";
import { getByMongooseIdErrorInfo, searchByMongooseIdErrorInfo } from "../../service/errors/info.js";

export default class Carts {

    getCart = async (id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(id),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            const cart = await cartsModel.findOne({ _id: id }).lean();
            if (!cart) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(id),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
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

    upgrateCart = async (email, idCart, idProduct) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(idCart)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            if (!mongoose.Types.ObjectId.isValid(idProduct)) {
                CustomError.createError({
                    name: "Product get error",
                    cause: getByMongooseIdErrorInfo(idProduct),
                    message: "Error Getting Product by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            const cart = await cartsModel.findById(idCart);
            if (!cart) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            const product = await productsModel.findById(idProduct);
            if (!product) {
                CustomError.createError({
                    name: "Product get error",
                    cause: searchByMongooseIdErrorInfo(idProduct),
                    message: "Error Getting Product by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            if (product.owner === email) CustomError.createError({
                name: "Product get error",
                cause: "You cannot add products you have created to the cart",
                message: "Error Getting Product by ID",
                code: EErrors.FORBIDDEN_ERROR
            })
            const existingProduct = cart.products.find(producto => producto.product.equals(idProduct));
            if (existingProduct) {
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
            if (!mongoose.Types.ObjectId.isValid(idCart)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            const cart = await cartsModel.updateOne({ _id: idCart },
                {
                    $push: { products: products }
                });
            if (!cart) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    updateQuantityProducts = async (idCart, idProduct, quantity) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(idCart)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            if (!mongoose.Types.ObjectId.isValid(idProduct)) {
                CustomError.createError({
                    name: "Product get error",
                    cause: getByMongooseIdErrorInfo(idProduct),
                    message: "Error Getting Product by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            const product = await productsModel.findById(idProduct);
            if (!product) {
                CustomError.createError({
                    name: "Product get error",
                    cause: searchByMongooseIdErrorInfo(idProduct),
                    message: "Error Getting Product by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            const result = await cartsModel.updateOne(
                { _id: idCart, 'products.product': idProduct },
                { $set: { 'products.$.quantity': quantity } }
            );
            if (result.modifiedCount === 0) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            return result;
        } catch (error) {
            throw error
        }
    }

    deleteCart = async (id) => {
        try {
            const result = await cartsModel.updateOne(
                {_id: id },
                { $set: { products: [] } }
            );
            if (result.matchedCount === 0) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(id),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    deleteProductToCart = async (idCart, idProduct) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(idCart)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            if (!mongoose.Types.ObjectId.isValid(idProduct)) {
                CustomError.createError({
                    name: "Product get error",
                    cause: getByMongooseIdErrorInfo(idProduct),
                    message: "Error Getting Product by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            const product = await productsModel.findById(idProduct);
            if (!product) {
                CustomError.createError({
                    name: "Product get error",
                    cause: searchByMongooseIdErrorInfo(idProduct),
                    message: "Error Getting Product by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            const result = await cartsModel.findByIdAndUpdate(
                idCart,
                { $pull: { products: { product: idProduct } } },
            )
            if (!result) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(idCart),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            return result;
        } catch (error) {
            throw error
        }
    }
}