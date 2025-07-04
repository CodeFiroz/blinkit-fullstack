import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
},
    {timestamps: true}
);

const SubCategory = mongoose.model("subCategory", subCategorySchema);

export default SubCategory;