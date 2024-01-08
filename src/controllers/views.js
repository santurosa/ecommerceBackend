import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import { productsService, cartsService, usersService, ticketsService } from "../repositories/index.js";

export const homeView = (req, res) => {
    res.render("home", {});
}

export const loginView = (req, res) => {
    res.render("login");
}

export const registerView = (req, res) => {
    res.render("register")
}

export const productsView = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const user = req.user;
    const { products, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsService.getProducts(limit, page);
    res.render("products", { products, hasPrevPage, hasNextPage, nextPage, prevPage, limit, user });
}

export const cartsView = async (req, res, next) => {
    try {
        const cid = req.params.cid
        const cart = await cartsService.getCart(cid);
        res.render("carts", { cart });
    } catch (error) {
        next(error);
    }
}

export const usersView = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const { users, hasPrevPage, hasNextPage, nextPage, prevPage } = await usersService.getUsers(limit, page);
        res.render("users", { users, hasPrevPage, hasNextPage, nextPage, prevPage, limit });
    } catch (error) {
        next(error);
    }
}

export const ticketsView = async (req, res, next) => {
    try {
        const email = req.user.email;
        const tickets = await ticketsService.getTicketsByEmail(email);
        res.render("tickets", { tickets });
    } catch (error) {
        next(error);
    }
}

export const chatView = (req, res) => {
    res.render("chat", {});
}

export const recoverPasswordView = (req, res) => {
    res.render("recoverPassword", {});
}

export const restartPasswordView = (req, res) => {
    const token = req.params.token;
    let email;
    jwt.verify(token, config.jwt.JWT_SECRET, (err, credentials) => {
        if (err) return res.status(401).json({ error: 'Token no valido' });
        if (!token) {
            CustomError.createError({
                name: "User update error",
                cause: `The link has expired or it does not match the email that requested to reset the password.`,
                message: "Error updating User's password",
                code: EErrors.FORBIDDEN_ERROR
            })
            return res.redirect('/login');
        }
        email = credentials.email;
    })
    res.render("restartPassword", { email });
}