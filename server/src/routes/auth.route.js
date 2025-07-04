import express from "express";
import { emailVerification, getCurrentUser, loginUser, registerUser, resetPassword, sendForgotOTP, verifyOTP } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/authMIddleWare.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-forgot-otp", sendForgotOTP);
router.post("/verify-otp", verifyOTP);
router.patch("/reset-password", resetPassword);

router.get("/verify/:token", emailVerification);
router.get("/me", protectRoute, getCurrentUser);

export default router;