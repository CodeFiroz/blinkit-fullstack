import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        default: 1
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},
    {timestamps: true}
);

const Cart = mongoose.model("cart",  cartSchema);

export default Cart;