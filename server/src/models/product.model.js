import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
    },
     slug: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: [],
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
        required: true,
    },
    quantity: {
        type: String,
        default: "1",
        required: true,
    },
    regularPrice: {
        type: String,
        required: true,
    },
    salePrice: {
        type: String,
    },
    description: {
        type: String,
        default: ""
    },
    moreInfo: {
        type: Object,
    },
    brand: {
        type: String,
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    publish: {
        type: Boolean,
        default: true,
    }

},
    { timestamps: true }
)

const Product = mongoose.model("product", productSchema);

export default Product;