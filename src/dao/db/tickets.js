import mongoose from "mongoose";
import { ticketsModel } from "../../models/tickets.js";
import { cartsModel } from "../../models/carts.js";
import { productsModel } from "../../models/products.js";
import CustomError from "../../service/errors/CustomError.js";
import EErrors from "../../service/errors/enums.js";
import { searchByMongooseIdErrorInfo } from "../../service/errors/info.js";

export default class Tickets {
    createTicket = async (id, email, date) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                CustomError.createError({
                    name: "Cart get error",
                    cause: getByMongooseIdErrorInfo(id),
                    message: "Error Getting Cart by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const code = await ticketsModel.countDocuments() + 1;

            const productsPrice = [];
            const productsToTicket = [];
            const outStock = [];
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
                const product = await productsModel.findOne({ _id: products[i].product._id });
                if (product.stock > 0) {
                    const toPay = product.price * products[i].quantity;
                    productsToTicket.push({ product: product._id, quantity: products[i].quantity });
                    productsPrice.push(toPay);
                    await cartsModel.updateOne(
                        { _id: id },
                        { $pull: { products: { product: product._id } } },
                    )
                    await productsModel.updateOne(
                        { _id: products[i].product._id },
                        { $inc: { stock: -products[i].quantity } },
                    )
                }
                if (product.stock === 0) outStock.push({ _id: product._id, title: product.title, quantity: products[i].quantity });
            }
            if (productsPrice.length < 1) return { message: 'The purchase could not be completed because no product is in stock.', outStock };
            for (let i = 0; i < productsPrice.length; i++) {
                amount += productsPrice[i];
            }

            const ticket = await ticketsModel.create({ code, purchase_datetime: date, products: productsToTicket, amount, purchaser: email });
            return { ticket, outStock };
        } catch (error) {
            throw error;
        }
    }
    getTicketsByEmail = async (email) => {
        try {
            const tickets = await ticketsModel.find({ purchaser: email }).sort({ purchase_datetime: -1 }).lean();
            if (!tickets.length > 0) CustomError.createError({
                name: "Tickets get error",
                cause: 'The user that has been received does not have tickets in his or her name or does not exist.',
                message: "Error Getting from this email",
                code: EErrors.DATABASE_ERROR
            })
            return tickets;
        } catch (error) {
            throw error;
        }
    }
}