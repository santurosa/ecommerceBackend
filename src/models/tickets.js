import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        require: true
    },
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
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    purchaser: {
        type: String,
        require: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    }
})

schema.pre("find", function(){
    this.populate("products.product");
})

export const ticketsModel = mongoose.model(collection, schema);