import Category from "../models/category.model.js";
import createSlug from "../utils/createSlug.js";
import { validateFields } from "../utils/validateFields.js";

//  get all categories controller ⚙️

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    if (!categories || categories.length === 0) {
      console.warn("🔴 [NOT_FOUND] No categories found");
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    console.log("✅ Categories fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.warn(`🔴 [CATEGORY_FETCH] can't all categories right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  delete  category controller ⚙️

export const deleteCategory = async (req, res) => {
  try {
    

    let { categoryId } = req.params;

    if (!categoryId) {
      console.warn(`🔴 [INVAILD_ARGUMENTS] category ID not found.`);
      return res.status(422).json({
        success: false,
        message: `Invalid category ID.`,
      });
    }

    const deleteAction = await Category.findByIdAndDelete(categoryId);

    if (!deleteAction) {
      console.warn("🔴 [DELETE_FAILED] Deleting category failed");
      return res.status(400).json({
        success: false,
        message: "something error while deleting category",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories deleted successfully 🚮",
    });
  } catch (error) {
    console.warn(`🔴 [CATEGORY_FETCH] can't all categories right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  create  category controller ⚙️

export const createCategory = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      console.warn(`🔴 [UPLOAD_FAILED] file upload failed.`);
      return res.status(422).json({
        success: false,
        message: `file upload cancelled.`,
        errors,
      });
    }

    let { title } = req.body;

    let errors = validateFields(req.body, {
      title: { required: true, type: "string" },
    });

    if (errors) {
      console.warn(`🔴 [INVAILD_ARGUMENTS] category title not found.`);
      return res.status(422).json({
        success: false,
        message: `Invalid category title.`,
        errors,
      });
    }

    const searchTitle = await Category.findOne({ name: title });

    if (searchTitle) {
      console.warn(`🔴 [CATEGORY_EXIST] category with same title exist.`);
      return res.status(400).json({
        success: false,
        message: `category with same title exist.`,
      });
    }

    const uploadedImage = {
      url: req.file.path,
      public_id: req.file.filename,
      resource_type: req.file.resource_type,
      format: req.file.format,
    };

    const slug = createSlug(title);

    const newCategory = new Category({
      name: title,
      slug,
      image: uploadedImage,
    });

    const category = await newCategory.save();

    if (!category) {
      console.warn(`🔴 [CATEFORY_SAVE_ERROR] category not saved.`);
      return res.status(400).json({
        success: false,
        message: `error while saving category.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories created successfully ✅",
    });
  } catch (error) {
    console.warn(`🔴 [CATEGORY_FETCH] can't all categories right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};
