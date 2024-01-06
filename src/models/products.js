import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import config from "../config/config.js";

const collection = "Products";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array,
        default: ["Sin imagenes"]
    },
    owner: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        default: config.admin.NAME
    }
})

schema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(collection, schema);