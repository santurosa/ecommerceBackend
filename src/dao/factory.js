import mongoose from "mongoose";
import config from "../config/config.js";
import { logger } from "../middlewares/logger.js";

export let Carts;
export let Messages;
export let Products;
export let Users;
export let Tickets;

switch (config.environment.PERSISTENCE) {
    case 'MONGO':
        const connection = mongoose.connect(config.environment.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        if(connection) logger.debug('Connection to Mongo database successfully completed');
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
    default:
        logger.warn('No se ha encontrado una persistencia con ese nombre');
        break;
}