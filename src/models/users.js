import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        unique: true,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts"
    },
    documents: {
        type: [
            {
                name: String,
                reference: String,
                _id: false
            }
        ],
        default: []
    },
    role: {
        type: String,
        enum: ["admin", "user", "user_premium"],
        default: "user"
    },
    last_connection: {
        type: String,
        require: true,
        validate: {
            validator: function (v) {
                return !isNaN(Date.parse(v));
            },
            message: props => `${props.value} no es una fecha válida.`
        }
    }
});

schema.pre('findOne', function(){
    this.populate('cart');
})

export const userModel = mongoose.model(collection, schema);