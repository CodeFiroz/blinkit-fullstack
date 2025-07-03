import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
   },
   orderId: {
    type: String,
    required: true
   },
   products: {
    type: String,
   },
   paymentId: {
    type: String
   },
   paymentStatus: {
    type: String
   },
   deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address'
   },
   deliveryStatus: {
    type: String,
    enums: ["pending", "processing", "out_for_delivery", "cancelled"],
    default: "pending"
   },
   subTotalAmount: {
    type: Number,
   },
   totalAmount: {
    type: Number,
   }
},
    {timestamps: true}
);

const Order = mongoose.model("order", orderSchema);

export default Order;