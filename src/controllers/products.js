import { productsService, usersService } from "../repositories/index.js";
import { mockingProducts } from '../utils/mocking.js';
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import { createProductErrorInfo, upgrateProductErrorInfo } from "../service/errors/info.js";
import config from "../config/config.js";
import MailingService from "../service/maling/mailing.js";


export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, title, category } = req.query;
        const { products, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsService.getProducts(limit, page, sort, title, category);
        res.send({ status: "success", payload: products, hasPrevPage, hasNextPage, nextPage, prevPage });
    } catch (error) {
        req.logger.error(`The cause is '${error}' in ${req.method} at ${req.url} - ${new Date().toString()} `);
        res.send({ status: "error", error });
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const result = await productsService.getProductById(pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const createProducts = async (req, res, next) => {
    const { title, description, price, status, stock, category, thumbnail } = req.body;
    try {        
        if (!title || !description || !price || !stock || !category) {
            CustomError.createError({
                name: "Product creation error",
                cause: createProductErrorInfo({ title, description, price, status, stock, category, thumbnail }),
                message: "Error Trying to create Product",
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const product = { title, description, price, status, stock, category, thumbnail, owner: req.user.email };
        const result = await productsService.createProducts(product);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const upgrateProduct = async (req, res, next) => {
    try {
        const id = req.params.pid;
        const upgrate = req.body;
        if (!upgrate) {
            CustomError.createError({
                name: "Product upgrate error",
                cause: upgrateProductErrorInfo(),
                message: "Error Trying to upgrate Product",
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const result = await productsService.upgrateProduct(req.user.email, id, upgrate);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.pid;
        const email = req.user.email;
        const result = await productsService.deleteProduct(email, id);
        
        const user = await usersService.getUserByEmail(email);
        if (email != config.adminName && user.role === 'user_premium') {
            const mailer = new MailingService();
            mailer.sendSimpleMail({
                from: 'E-Commerce <santurosa999@gmail.com>',
                to: email,
                subject: 'Eliminación de producto a su nombre',
                html: `<div>
                            <p>¡Hola! Ha sido eliminado el siguiente producto a su nombre del ecommerce:</p>
                            <div>
                                <h1>${result.title}</h1>
                                <p>Categoría: ${result.category}</p>
                                <p>${result.description}</p>
                                <p>$ ${result.price}</p>
                                <p>${result.stock} disponible(s)</p>
                            </div>
                        </div>`
            })
        }
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

export const mocking = async (req, res) => {
    try {
        const products = await mockingProducts(100);
        res.send({ status: "success", products: products });
    } catch (error) {
        req.logger.error(`The cause is '${error}' in ${req.method} at ${req.url} - ${new Date().toString()} `);
        res.status(500).send({ status: "error", error });
    }
}