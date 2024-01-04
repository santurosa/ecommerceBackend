import { cartsService, ticketsService } from "../repositories/index.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";

export const getCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const result = await cartsService.getCart(cid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const createCart = async (req, res) => {
    try {
        const result = await cartsService.createCart();
        res.send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error(`The cause is '${error}' in ${req.method} at ${req.url} - ${new Date().toString()} `);
        res.status(500).send({ status: "error", error });
    }
}

export const upgrateCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await cartsService.upgrateCart(req.user.email, cid, pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const upgrateCartByBody = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const products = req.body;
        if (!products) {
            CustomError.createError({
                name: "Product to upgrate Cart error",
                cause: upgrateProductErrorInfo(),
                message: "Error Trying to upgrate Product to Cart",
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const result = await cartsService.upgrateCartByBody(cid, products);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const updateQuantityProducts = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body
        if (quantity) {
            const result = await cartsService.updateQuantityProducts(cid, pid, quantity);
            res.send({ status: "success", payload: result });
        } else res.status(422).send({ status: "error", message: "No se ha recibido quantity para actualizar" });
    } catch (error) {
        next(error);
    }
}

export const emptyCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const result = await cartsService.emptyCart(cid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const deleteProductToCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await cartsService.deleteProductToCart(cid, pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const purchase = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const email = req.user.email;
        const result = await ticketsService.createTicket(cid, email);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const getTicketsByEmail = async (req, res, next) => {
    try {
        const email = req.user.email;
        const tickets = await ticketsService.getTicketsByEmail(email);
        res.send({ status: "success", tickets });
    } catch (error) {
        next(error);
    }
}