export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }
    getCart = async (id) => {
        const cart = await this.dao.getCart(id);
        return cart;
    }
    createCart = async () => {
        const result = await this.dao.createCart();
        return result;
    }
    upgrateCart = async (email, idCart, idProduct) => {
        const result = await this.dao.upgrateCart(email, idCart, idProduct);
        return result;
    }
    upgrateCartByBody = async (idCart, products) => {
        const result = await this.dao.upgrateCartByBody(idCart, products);
        return result;
    }
    updateQuantityProducts = async (idCart, idProduct, quantity) => {
        const result = await this.dao.updateQuantityProducts(idCart, idProduct, quantity);
        return result;
    }
    emptyCart = async (id) => {
        const result = await this.dao.emptyCart(id);
        return result;
    }
    deleteProductToCart = async (idCart, idProduct) => {
        const result = await this.dao.deleteProductToCart(idCart, idProduct);
        return result;
    }
    deleteCart = async (id) => {
        const result = await this.dao.deleteCart(id);
        return result;
    }
    deleteCarts = async (carts) => {
        const result = await this.dao.deleteCarts(carts);
        return result;
    }
}
