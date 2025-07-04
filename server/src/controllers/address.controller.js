import Address from "../models/address.model.js";
import User from "../models/user.model.js";


//  get all address by user controller ⚙️

export const getAddress = async (req, res) => {
    try {

        const { user } = req.user;

        const addresses = await User.findById(user._id).select("address").populate("address");

        console.log(`✅ fetched all addresses by user`);
        return res.status(200).json({
            success: true,
            message: `fetched all addresses`,
            data: {
                addresses
            }
        });


    } catch (error) {
        console.warn(`🔴 [GET_USER_ADDRESS] can't get user addresses now.`);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Ooops! Internal server error 🛜.`
        });
    }
}

//  get all address by user controller ⚙️

export const addNewAddress = async (req, res) => {
    try {

        const { user } = req.user;

        let errors = validateFields(req.body, {
            name: { required: true, type: 'string' },
            addressLine: { required: true, type: 'string' },
            city: { required: true, type: 'string' },
            state: { required: true, type: 'string' },
            pincode: { required: true, type: 'number', maxLength: 6 },
            country: { required: true, type: 'string' },
            mobile: { required: true, type: 'number', minLength: 10, maxLength: 10 },
        });

        let { name, addressLine, city, state, pincode, country, mobile } = req.body;

        if (errors) {
            console.warn(`🔴 [INVAILD_ARGUMENTS] field data validation failed.`);
            return res.status(422).json({
                success: false,
                message: `Invalid data validation.`,
                errors
            });
        }

        const newAddress = new Address({
            personName: name,
            addressLine,
            city,
            state,
            pincode,
            country,
            mobile
        });

        const saveAddress = await newAddress.save();

        if (!saveAddress) {
            console.warn(`🔴 [ADDRESS_SAVE_ERROR] can't save address right now.`);
            return res.status(400).json({
                success: false,
                message: `something error : Can't save address right now.`,
            });
        }


        const updateAddress = await User.findByIdAndUpdate(user._id, {
            $push: { address: saveAddress._id }
        }, { new: true });


        console.log(`✅ new address added`);
        return res.status(201).json({
            success: true,
            message: `new address saved`,
            data: {
                updateAddress
            }
        });

    } catch (error) {
        console.warn(`🔴 [ADD_USER_ADDRESS] can't create new addresses now.`);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Ooops! Internal server error 🛜.`
        });
    }
}


/*

functions
1. get all address
2. add new address
3. update a address
4. delete a address

*/