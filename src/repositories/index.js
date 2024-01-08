import { Carts, Messages, Products, Tickets, Users } from "../dao/factory.js";
import ProductsRepository from "./Products.js";
import CartsRepository from "./Carts.js";
import MessageRepository from "./Messages.js";
import UsersRepository from "./Users.js";
import TicketsRepository from "./Tickets.js";

export const productsService = new ProductsRepository(new Products());
export const cartsService = new CartsRepository(new Carts());
export const messagesService = new MessageRepository(new Messages());
export const usersService = new UsersRepository(new Users());
export const ticketsService = new TicketsRepository(new Tickets());