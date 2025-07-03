import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    addressLine: {
        type: String,
        trime: true,
    },
    city: {
        type: String,
        trime: true,
    },
    state: {
        type: String,
        trime: true,
    },
    pincode: {
        type: String,
        trime: true,
    },
    country: {
        type: String,
        trime: true,
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