import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    personName: {
        type: String,
        trime: true,
        required: true,
    },
    addressLine: {
        type: String,
        trime: true,
        required: true,
    },
    city: {
        type: String,
        trime: true,
        required: true,
    },
    state: {
        type: String,
        trime: true,
        required: true,
    },
    pincode: {
        type: String,
        trime: true,
        required: true,
    },
    country: {
        type: String,
        trime: true,
        default: "India"
    },
    mobile: {
        type: String,
        trime: true,
    }
    
},
    {timestamps: true}
)

const Address = mongoose.model('address', addressSchema);

export default Address;