import { productsService } from "../repositories/index.js";
import { mockingProducts } from '../utils.js';
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import { createProductErrorInfo, upgrateProductErrorInfo } from "../service/errors/info.js";


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
        console.log(req.user)
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.pid;
        const result = await productsService.deleteProduct(req.user.email, id);
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