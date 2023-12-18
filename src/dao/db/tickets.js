import mongoose from "mongoose";
import { ticketsModel } from "../../models/tickets.js";
import { cartsModel } from "../../models/carts.js";
import { productsModel } from "../../models/products.js";
import CustomError from "../../service/errors/CustomError.js";
import EErrors from "../../service/errors/enums.js";
import { searchByMongooseIdErrorInfo } from "../../service/errors/info.js";

export default class Tickets {
    createTicket = async (id, email) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(id),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const code = Math.floor(Math.random() * 1e10).toString().padStart(10, '0');
            const date = new Date().toString()

            let productsPrice = [];
            let amount = 0;
            const cart = await cartsModel.findOne({ _id: id });
            if (!cart) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: searchByMongooseIdErrorInfo(id),
                    message: "Error Getting Cart by ID",
                    code: EErrors.DATABASE_ERROR
                })
            }
            const products = cart.products.toObject();
            if (products.length < 1) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: cartWithoutProductsErrorInfo(),
                    message: "Error Getting Products in the Cart",
                    code: EErrors.DATABASE_ERROR
                })
            }
            for (let i = 0; i < products.length; i++) {
                const product = await productsModel.findOne({ _id: products[i].product._id});
                if (product.stock > 0) {
                    const toPay = product.price * products[i].quantity;
                    productsPrice.push(toPay);
                    await cartsModel.updateOne(
                        { _id: id },
                        { $pull: { products: { product: product._id } } },
                    )
                }
            }
            if (productsPrice.length < 1) return products;
            for (let i = 0; i < productsPrice.length; i++) {
                amount += productsPrice[i];                
            }

            const ticket = await ticketsModel.create({ code: code, purchase_datetime: date, amount, purchaser: email });
            return ticket;
        } catch (error) {
            throw error;
        }
    }
}