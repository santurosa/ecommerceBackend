import ProductDTO from "../dto/product.js";

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }
    getProducts = async (limit, page, sort, title, category, stock) => {
        const products = await this.dao.getProducts(limit, page, sort, title, category, stock);
        return products;
    }
    getProductById = async (id) => {
        const product = await this.dao.getProductById(id);
        return product;
    }
    createProducts = async (product) => {
        const productToInsert = new ProductDTO(product);
        const result = await this.dao.createProducts(productToInsert);
        return result;
    }
    upgrateProduct = async (email, id, product) => {
        const result = await this.dao.upgrateProduct(email, id, product);
        return result;
    }
    updateThumbnails = async (email, id, thumbnail) => {
        const result = await this.dao.updateThumbnails(email, id, thumbnail);
        return result;
    }
    deleteProduct = async (email, id) => {
        const result = await this.dao.deleteProduct(email, id);
        return result;
    }
}