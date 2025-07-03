import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        default: ""
    }    
},
    {timestamps: true}
);

const Category = mongoose.model("category", categorySchema);

export default Category;