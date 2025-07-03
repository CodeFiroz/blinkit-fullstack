import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required."],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required."],
        select: false,
    },
    phone: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    verifyEmail: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
    },
    address: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'address',
            default: null,
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cart',
            select: false,
            default: null,
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order',
            select: false,
        }
    ],
    forgotPasswordOTP: {
        type: String,
        default: null,
        select: false,
    },
    forgotPasswordExpiry: {
        type: Date,
        default: null,
        select: false,
    },
    role: {
        type: String,
        enum: ["customer", "vendor", "admin"],
        default: "customer"
    }

},
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;