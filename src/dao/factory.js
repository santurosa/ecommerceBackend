import mongoose from "mongoose";
import config from "../config/config.js";
import { logger } from "../middlewares/logger.js";

export let Carts;
export let Messages;
export let Products;
export let Users;
export let Tickets;

switch (config.persistence) {
    case 'MONGO':
        const connection = mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const { default: CartsMongo } = await import("./db/carts.js");
        Carts = CartsMongo;
        const { default: MessagesMongo } = await import("./db/messages.js");
        Messages = MessagesMongo;
        const { default: ProductsMongo } = await import("./db/products.js");
        Products = ProductsMongo;
        const { default: UserssMongo } = await import("./db/users.js");
        Users = UserssMongo;
        const { default: TicketsMongo } = await import("./db/tickets.js");
        Tickets = TicketsMongo;
        break;
    case 'FILE':
        const { default: CartsFile } = await import("./fileSystem/carts.js");
        Carts = CartsFile;
        const { default: MessagesFile } = await import("./fileSystem/messages.js");
        Messages = MessagesFile;
        const { default: ProductsFile } = await import("./fileSystem/products.js");
        Products = ProductsFile;
        const { default: UsersFile } = await import("./fileSystem/users.js");
        Users = UsersFile;
        const { default: TicketsFile } = await import("./fileSystem/tickets.js");
        Tickets = TicketsFile;
        break;
    default:
        logger.warn('No se ha encontrado una persistencia con ese nombre');
        break;
}