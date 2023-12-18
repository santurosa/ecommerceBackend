export default class CartDTO {
    constructor(cart) {
        this.products = !cart.products ? cart.products : [],
        this.products.quantity = +cart.products.quantity < 1 ? cart.products.quantity : 1 
    }
}