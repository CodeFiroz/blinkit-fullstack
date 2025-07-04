import express from "express";
import { protectRoute } from "../middlewares/authMIddleWare.js";
import { createCategory, deleteCategory, getCategories } from "../controllers/category.controller.js";
import adminRoute from "../middlewares/adminRoute.js";
import { categoryUpload } from "../config/cloudinary.js";


const router = express.Router();

router.get("/categories ", getCategories);

router.delete(
    "/categories/:categoryId", 
    protectRoute, 
    adminRoute, 
    deleteCategory
);


router.post(
  "/categories",
  protectRoute,
  adminRoute,
  categoryUpload.single("image"), // <-- renamed
  createCategory
);


export default router;