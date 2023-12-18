export default class Products {

    getProducts = async (limit, page, sort, title, category, stock) => {
        try {
            const filter = {};

            if (title) {
                filter.title = { $regex: title, $options: "i" }
            }

            if (category) {
                filter.category = { $regex: category, $options: "i" }
            }

            if (stock === "true") {
                filter.stock = { $gt: 0 };
            }

            const sortNumber = sort === "asc" ? { price: 1 } : sort === "des" ? { price: -1 } : {};

            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate(filter, { limit, page, sort: sortNumber });
            const products = docs.map(product => product.toObject());
            return { products, hasPrevPage, hasNextPage, nextPage, prevPage };
        } catch (error) {
            throw error;
        }
    }

    getProductById = async (idProduct) => {
        try {
            const result = await productsModel.findById(idProduct);
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

    deleteProduct = async (idProduct) => {
        try {
            const result = await productsModel.deleteOne({ _id: idProduct });
            return result;
        } catch (error) {
            throw error;
        }
    }

    upgrateProduct = async (idProduct, upgrate) => {
        try {
            const result = await productsModel.updateOne({ _id: idProduct }, upgrate);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
