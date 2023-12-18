import { Carts, Messages, Products, Tickets, Users } from "../dao/factory.js";
import ProductsRepository from "./products.js";
import CartsRepository from "./Carts.js";
import MessageRepository from "./messages.js";
import UserssRepository from "./Users.js";
import TicketsRepository from "./Tickets.js";

export const productsService = new ProductsRepository(new Products());
export const cartsService = new CartsRepository(new Carts());
export const messagesService = new MessageRepository(new Messages());
export const usersService = new UserssRepository(new Users());
export const ticketsService = new TicketsRepository(new Tickets());