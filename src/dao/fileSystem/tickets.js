import { ticketsModel } from "../../models/tickets.js";
import { cartsModel } from "../../models/carts.js";
import { productsModel } from "../../models/products.js";

export default class Tickets {
    createTicket = async (idCart, email) => {
        try {
            const code = Math.floor(Math.random() * 1e10).toString().padStart(10, '0');
            const date = new Date().toString()

            let productsPrice = [];
            let amount = 0;
            const cart = await cartsModel.findOne({ _id: idCart });
            const products = cart.products.toObject();
            for (let i = 0; i < products.length; i++) {
                const product = await productsModel.findOne({ _id: products[i].product._id});
                if (product.stock > 0) {
                    const toPay = product.price * products[i].quantity;
                    productsPrice.push(toPay);
                    await cartsModel.findByIdAndUpdate(
                        idCart,
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