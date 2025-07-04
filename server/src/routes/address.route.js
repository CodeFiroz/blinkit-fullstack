import express from "express";
import { protectRoute } from "../middlewares/authMIddleWare.js";
import { addNewAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/address.controller.js";


const router = express.Router();

router.get("/addresses", protectRoute, getAddresses);
router.post("/addresses", protectRoute, addNewAddress);

router.delete("/addresses/:addressId", protectRoute, deleteAddress);
router.put("/addresses/:addressId", protectRoute, updateAddress);



export default router;