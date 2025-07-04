import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import { validateFields } from "../utils/validateFields.js"

//  get all address by user controller ⚙️

export const getAddresses = async (req, res) => {
  try {
    const { user } = req.user;

    const addresses = await User.findById(user._id)
      .select("address")
      .populate("address");

    console.log(`✅ fetched all addresses by user`);
    return res.status(200).json({
      success: true,
      message: `fetched all addresses`,
      data: addresses
    });
  } catch (error) {
    console.warn(`🔴 [GET_USER_ADDRESS] can't get user addresses now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  get all address by user controller ⚙️

export const addNewAddress = async (req, res) => {
  try {
    const { user } = req.user;

    let errors = validateFields(req.body, {
      name: { required: true, type: "string" },
      addressLine: { required: true, type: "string" },
      city: { required: true, type: "string" },
      state: { required: true, type: "string" },
      pincode: { required: true, type: "number", maxLength: 6 },
      country: { required: true, type: "string" },
      mobile: { required: true, type: "number", minLength: 10, maxLength: 10 },
    });

    let { name, addressLine, city, state, pincode, country, mobile } = req.body;

    if (errors) {
      console.warn(`🔴 [INVAILD_ARGUMENTS] field data validation failed.`);
      return res.status(422).json({
        success: false,
        message: `Invalid data validation.`,
        errors,
      });
    }

    const newAddress = new Address({
      personName: name,
      addressLine,
      city,
      state,
      pincode,
      country,
      mobile,
    });

    const saveAddress = await newAddress.save();

    if (!saveAddress) {
      console.warn(`🔴 [ADDRESS_SAVE_ERROR] can't save address right now.`);
      return res.status(400).json({
        success: false,
        message: `something error : Can't save address right now.`,
      });
    }

    const updateAddress = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { address: saveAddress._id },
      },
      { new: true }
    );

    if (!updateAddress) {
      console.warn(`🔴 [ADDRESS_LINK_FAILED] address saved but not linked.`);
      return res.status(400).json({
        success: false,
        message: `something error : address saved but not linked.`,
      });
    }

    console.log(`✅ new address added`);
    return res.status(201).json({
      success: true,
      message: `new address saved`,
      data: updateAddress,
    });
  } catch (error) {
    console.warn(`🔴 [ADD_USER_ADDRESS] can't create new addresses now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  delete an address controller ⚙️


export const deleteAddress = async (req, res) => {
  try {
    
    const addressId = req.params;

    if (!addressId) {
      console.warn(`🔴 [INVAILD_ARGUMENTS] address ID not found.`);
      return res.status(422).json({
        success: false,
        message: `Invalid data validation. addressID not found`,
      });
    }

    const Delete = await Address.findByIdAndDelete(addressId);

    if (!Delete) {
      console.warn(`🔴 [DELETE_FAILED] address deleting failed.`);
      return res.status(400).json({
        success: false,
        message: `Deleting address is failed`,
      });
    }

     console.log(`✅ address deleted successfully.`);
    return res.status(201).json({
      success: true,
      message: `address successfully deleted.`,
    });

  } catch (error) {
    console.warn(`🔴 [DELETE_USER] can't delete address now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  get all address by user controller ⚙️

export const updateAddress = async (req, res) => {
  try {
    const { user } = req.user;

    const addressId = req.params;

    let errors = validateFields(req.body, {
      name: { required: true, type: "string" },
      addressLine: { required: true, type: "string" },
      city: { required: true, type: "string" },
      state: { required: true, type: "string" },
      pincode: { required: true, type: "number", maxLength: 6 },
      country: { required: true, type: "string" },
      mobile: { required: true, type: "number", minLength: 10, maxLength: 10 },
    });

    let { name, addressLine, city, state, pincode, country, mobile } = req.body;

    if (errors) {
      console.warn(`🔴 [INVAILD_ARGUMENTS] field data validation failed.`);
      return res.status(422).json({
        success: false,
        message: `Invalid data validation.`,
        errors,
      });
    }

    const Update = Address.findOneAndUpdate({_id: addressId}, {$set: {
         personName: name,
      addressLine,
      city,
      state,
      pincode,
      country,
      mobile,
    }}, {new: true});

    
    if (!Update) {
      console.warn(`🔴 [ADDRESS_UPDATE_ERROR] can't update address right now.`);
      return res.status(400).json({
        success: false,
        message: `something error : Can't update address right now.`,
      });
    }
    console.log(`✅ address updated`);
    return res.status(201).json({
      success: true,
      message: `address updated`,
      data: Update,
    });
  } catch (error) {
    console.warn(`🔴 [FAILED_UPADTE_ADDRESS] can't update new addresses now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};