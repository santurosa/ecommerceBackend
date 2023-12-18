import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
        require: true,
        validate: {
            validator: function (v) {
                return !isNaN(Date.parse(v));
            },
            message: props => `${props.value} no es una fecha válida.`
        }
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

export const ticketsModel = mongoose.model(collection, schema);