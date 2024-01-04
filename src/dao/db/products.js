import mongoose from "mongoose";
import { productsModel } from "../../models/products.js";
import CustomError from "../../service/errors/CustomError.js";
import EErrors from "../../service/errors/enums.js";
import { getByMongooseIdErrorInfo, searchByMongooseIdErrorInfo } from "../../service/errors/info.js";
import config from "../../config/config.js";

export default class Products {

    getProducts = async (limit, page, sort, title, category, stock) => {
        try {
            const filter = {};

            if (title) filter.title = { $regex: title, $options: "i" };
            if (category) filter.category = { $regex: category, $options: "i" };
            if (stock === "true") filter.stock = { $gt: 0 };
            const sortNumber = sort === "asc" ? { price: 1 } : sort === "des" ? { price: -1 } : {};

            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate(filter, { limit, page, sort: sortNumber });
            const products = docs.map(product => product.toObject());
            return { products, hasPrevPage, hasNextPage, nextPage, prevPage };
        } catch (error) {
            throw error;
        }
    }

    getProductById = async (id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) CustomError.createError({
                name: "Product get error",
                cause: getByMongooseIdErrorInfo(id),
                message: "Error Getting Product by ID",
                code: EErrors.INVALID_TYPE_ERROR
            })
            const result = await productsModel.findById(id);
            if (!result) CustomError.createError({
                    name: "Product get error",
                    cause: searchByMongooseIdErrorInfo(id),
                    message: "Error Getting Product by ID",
                    code: EErrors.DATABASE_ERROR
                })
            return result;
        } catch (error) {
            throw error;
        }
    }

    createProducts = async (product) => {
        try {
            const result = await productsModel.create(product);
            return result;
        } catch (error) {
            throw error;
        }
    }

    deleteProduct = async (email, id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) CustomError.createError({
                    name: "Product delete error",
                    cause: getByMongooseIdErrorInfo(id),
                    message: "Error Deleting Product by ID",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            const product = await productsModel.findById(id);
            if (!product) CustomError.createError({
                name: "Product delete error",
                cause: searchByMongooseIdErrorInfo(id),
                message: "Error Deleting Product by ID",
                code: EErrors.INVALID_TYPE_ERROR
            })
            if (email === product.owner || email === config.adminName) {
                const result = await productsModel.findByIdAndDelete(id);
                return result;
            } else CustomError.createError({
                name: "Product delete error",
                cause: "You can only delete products that you own.",
                message: "Error Deleting Product by ID",
                code: EErrors.FORBIDDEN_ERROR
            })
        } catch (error) {
            throw error;
        }
    }

    upgrateProduct = async (email, id, upgrate) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                CustomError.createError({
                    name: "Product update error",
                    cause: getByMongooseIdErrorInfo(id),
                    message: "Error updating Product by ID",
                    code: EErrors.INVALID_PARAMS_ERROR
                })
            }
            const product = await productsModel.findById(id);
            if (!product) CustomError.createError({
                name: "Product update error",
                cause: searchByMongooseIdErrorInfo(id),
                message: "Error updating Product by ID",
                code: EErrors.INVALID_TYPE_ERROR
            })
            if (email === product.owner || email === config.adminName) {
                const result = await productsModel.updateOne({ _id: id }, upgrate);
                return result;
            } else CustomError.createError({
                name: "Product update error",
                cause: "You can only modify products that you own.",
                message: "Error updating Product by ID",
                code: EErrors.FORBIDDEN_ERROR
            })
        } catch (error) {
            throw error;
        }
    }

    updateThumbnails = async (email, id, thumbnail) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                CustomError.createError({
                    name: "Product update error",
                    cause: getByMongooseIdErrorInfo(id),
                    message: "Error updating Product by ID",
                    code: EErrors.INVALID_PARAMS_ERROR
                })
            }
            const product = await productsModel.findById(id);
            if (!product) CustomError.createError({
                name: "Product update error",
                cause: searchByMongooseIdErrorInfo(id),
                message: "Error updating Product by ID",
                code: EErrors.INVALID_TYPE_ERROR
            })
            if (email === product.owner || email === config.adminName) {
                if (product.thumbnail[0] === "Sin imagenes") {
                    const result = await productsModel.updateOne({ _id: id }, { $set: { thumbnail } });
                    return result;
                }
                const result = await productsModel.updateOne({ _id: id }, { $push: { thumbnail } });
                return result;
            } else CustomError.createError({
                name: "Product update error",
                cause: "You can only modify products that you own.",
                message: "Error updating Product by ID",
                code: EErrors.FORBIDDEN_ERROR
            })
        } catch (error) {
            throw error;
        }
    }
}
