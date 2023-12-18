import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
                quantity: Number,
                _id: false
            }
        ],
        default: []
    }
})

schema.pre("findOne", function(){
    this.populate("products.product");
})

export const cartsModel = mongoose.model(collection, schema);