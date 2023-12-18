export default class ProductDTO {
    constructor(product) {
        if (product._id) {
            this._id = product._id;
        }
        this.title = product.title.trim(),
            this.description = product.description.trim(),
            this.price = +product.price > 0 ? +product.price : 0,
            this.status = typeof product.status !== 'boolean' ? true : product.status,
            this.stock = +product.stock > 0 ? +product.stock : 0,
            this.category = product.category.trim(),
            this.thumbnail = !Array.isArray(product.thumbnail) || product.thumbnail.length <= 0 ? ["Sin imagenes"] : product.thumbnail
            this.owner = !product.owner ? 'admin' : product.owner.toLowerCase().trim()
    }
}