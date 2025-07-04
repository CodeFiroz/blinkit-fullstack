import Mailer from "../mails/mailer.js";
import User from "../models/user.model.js";
import { genrateToken } from "../utils/manageToken.js";
import { validateFields } from "../utils/validateFields.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//  user registeration controller ⚙️

export const registerUser = async (req, res) => {
  try {
    let errors = validateFields(req.body, {
      name: { required: true, type: "string" },
      email: { required: true, type: "email" },
      password: { required: true, minLength: 6 },
      role: { enum: ["customer", "vendor"] },
    });

    let { name, email, password, role } = req.body;

    if (errors) {
      console.warn(
        `� [VALIDATION_ERROR] Request body contains invalid or missing fields.`
      );

      return res.status(422).json({
        success: false,
        message:
          "Oops! Some required fields didn't pass validation. Please check your input.",
        errors,
      });
    }

    const emailSearch = await User.findOne({ email });

    if (emailSearch) {
      console.warn(`🔴 [EXIST_USER] email already in use.`);
      return res.status(409).json({
        success: false,
        message: `${email} is already in use.`,
      });
    }

    let encryptPassword = await bcrypt.hash(password, 10);

    let register = new User({
      name,
      email,
      password: encryptPassword,
      role,
    });

    const savedUser = await register.save();

    if (!savedUser) {
      console.warn(`🔴 [REGISTER_ERROR] error while saving user.`);
      return res.status(501).json({
        success: false,
        message: `can't register user right now. Try again`,
      });
    }

    genrateToken(res, savedUser._id);

    const verificationToken = jwt.sign(
      { userid: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const verificationLink = `http://localhost:5000/verification/${verificationToken}`;

    await Mailer(
      savedUser.email,
      "welcome",
      { verificationLink: verificationLink, userName: savedUser.name },
      "Welcome to Blinkit"
    );

    console.log(`✅ Yaaay new user is registered 🎉`);
    return res.status(201).json({
      success: true,
      message: `user is registered`,
      data: {
        user_id: savedUser._id,
        full_name: savedUser.name,
        email_address: savedUser.email,
        phone_number: savedUser.phone,
      },
    });
  } catch (error) {
    console.warn(`🔴 [AUTH_REGISTER] can't register user right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  user log in controller ⚙️

export const loginUser = async (req, res) => {
  try {
    let errors = validateFields(req.body, {
      email: { required: true, type: "email" },
      password: { required: true },
    });

    let { email, password } = req.body;

    if (errors) {
      console.warn(
        `🚫 [VALIDATION_ERROR] Request body contains invalid or missing fields.`
      );

      return res.status(422).json({
        success: false,
        message:
          "Oops! Some required fields didn't pass validation. Please check your input.",
        errors,
      });
    }

    const userSearch = await User.findOne({ email }).select("+password");

    if (!userSearch) {
      console.warn(`🔴 [UNKNOWN_USER] Email is not registered.`);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    let matchPassword = await bcrypt.compare(password, userSearch.password);

    if (!matchPassword) {
      console.warn(`🔴 [INCORRECT_PASSWORD] user password is not matched.`);
      return res.status(401).json({
        success: false,
        message: `incorrect password`,
      });
    }

    if (userSearch.status != "active") {
      console.warn(
        `🔴 [INACTIVE_USER] your account is inactive or suspended. contact us for more details.`
      );
      return res.status(401).json({
        success: false,
        message: `suspended or inactive account`,
      });
    }

    if (userSearch.verifyEmail == false) {
      console.warn(`🔴 [NEED_VERIFICATION] email not verified`);
      return res.status(401).json({
        success: false,
        message: ` Please verify your email. we sent a verification mail to your address. Check the spam folder`,
      });
    }

    genrateToken(res, userSearch._id);

    userSearch.lastLogin = new Date.now();

    await userSearch.save();

    console.log(`✅ user is logged in 🎉`);
    return res.status(200).json({
      success: true,
      message: `successfully logged in`,
      data: {
        user_id: userSearch._id,
        full_name: userSearch.name,
        email_address: userSearch.email,
        phone_number: userSearch.phone,
      },
    });
  } catch (error) {
    console.warn(`🔴 [AUTH_SIGNIN] can't signed in user right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  forgot password OTP send controller ⚙️

export const sendForgotOTP = async (req, res) => {
  try {
    let errors = validateFields(req.body, {
      email: { required: true, type: "email" },
    });

    let { email } = req.body;

    if (errors) {
      console.warn(
        `� [VALIDATION_ERROR] Request body contains invalid or missing fields.`
      );

      return res.status(422).json({
        success: false,
        message:
          "Oops! Some required fields didn't pass validation. Please check your input.",
        errors,
      });
    }

    const userSearch = await User.findOne({ email });

    if (!userSearch) {
      console.warn(`🔴 [UNKNOWN_USER] email in not registered.`);
      return res.status(409).json({
        success: false,
        message: `invalid email or password`,
      });
    }

    const genrateOTP = Math.floor(Math.random() * 999999) + 100000;

    userSearch.forgotPasswordOTP = genrateOTP;
    userSearch.forgotPasswordExpiry = new Date.now() + 10 * 60 * 1000;

    await userSearch.save();

    // send email OTP to user mail

    console.log(`✅ Forgot password OTP sent.`);
    return res.status(200).json({
      success: true,
      message: `OTP sent to registred email address`,
    });
  } catch (error) {
    console.warn(`🔴 [FORGOT_OTP_SEND] can't send OTP right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  OTP verification controller ⚙️

export const verifyOTP = async (req, res) => {
  try {
    let errors = validateFields(req.body, {
      email: { required: true, type: "email" },
      otp: { required: true, type: "number", minLength: 6, maxLength: 6 },
    });

    let { email, otp } = req.body;

    if (errors) {
      console.warn(
        `� [VALIDATION_ERROR] Request body contains invalid or missing fields.`
      );

      return res.status(422).json({
        success: false,
        message:
          "Oops! Some required fields didn't pass validation. Please check your input.",
        errors,
      });
    }

    const userSearch = await User.findOne({ email });

    if (!userSearch) {
      console.warn(`🔴 [UNKNOWN_USER] email in not registered.`);
      return res.status(409).json({
        success: false,
        message: `invalid email or password`,
      });
    }

    if (userSearch.forgotPasswordOTP !== otp) {
      console.warn(`🔴 [INCORRET_OTP] incorrect OTP entered.`);
      return res.status(400).json({
        success: false,
        message: `incorrect OTP`,
      });
    }

    if (Date.now() > userSearch.forgotPasswordExpiry) {
      console.warn(`🔴 [OTP_EXPIRED] OTP is expired.`);
      return res.status(400).json({
        success: false,
        message: `OTP expired`,
      });
    }

    console.log(`✅ OTP verified.`);
    return res.status(200).json({
      success: true,
      message: `OTP is verified`,
    });
  } catch (error) {
    console.warn(`🔴 [OTP_VERIFICATION] OTP verification failed.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  reset password controller ⚙️

export const resetPassword = async (req, res) => {
  try {
    let errors = validateFields(req.body, {
      email: { required: true, type: "email" },
      otp: { required: true, type: "number", minLength: 6, maxLength: 6 },
      newpassword: { required: true, type: "string", minLength: 6 },
    });

    let { email, otp, newpassword } = req.body;

    if (errors) {
      console.warn(
        `� [VALIDATION_ERROR] Request body contains invalid or missing fields.`
      );

      return res.status(422).json({
        success: false,
        message:
          "Oops! Some required fields didn't pass validation. Please check your input.",
        errors,
      });
    }

    const userSearch = await User.findOne({ email }).select("+password");

    if (!userSearch) {
      console.warn(`🔴 [UNKNOWN_USER] email in not registered.`);
      return res.status(409).json({
        success: false,
        message: `invalid email or password`,
      });
    }

    if (userSearch.forgotPasswordOTP !== otp) {
      console.warn(`🔴 [INCORRET_OTP] incorrect OTP entered.`);
      return res.status(400).json({
        success: false,
        message: `incorrect OTP`,
      });
    }

    if (Date.now() > userSearch.forgotPasswordExpiry) {
      console.warn(`🔴 [OTP_EXPIRED] OTP is expired.`);
      return res.status(400).json({
        success: false,
        message: `OTP expired`,
      });
    }

    const encryptPassword = bcrypt.hash(newpassword, 10);

    userSearch.password = encryptPassword;
    userSearch.forgotPasswordOTP = null;
    userSearch.forgotPasswordExpiry = null;

    await userSearch.save();

    console.log(`✅ Successfully password reseted.`);
    return res.status(200).json({
      success: true,
      message: `Password is reseted`,
    });
  } catch (error) {
    console.warn(`🔴 [PASSWORD_RESET] Password reset failed.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  email verification user controller ⚙️

export const emailVerification = async (req, res) => {
  try {
    let { token } = req.params;

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      console.warn(
        `🔴 [INVAILID_VERIFICATION_TOKEN] can't decode verification token.`
      );
      return res.status(400).json({
        success: false,
        message: `Invalid token. can't verify.`,
      });
    }

    const user_id = decode.userId;

    const findUser = await User.findById(user_id);

    if (!findUser) {
      console.warn(`🔴 [USER_NOT_FOUND] user doesn't exist.`);
      return res.status(400).json({
        success: false,
        message: `Invalid token. user not found.`,
      });
    }

    findUser.verifyEmail = true;

    await findUser.save();

    console.log(`✅ [EMAIL_VERIFIED] user email verified successfully.`);
    return res.status(200).json({
      success: false,
      message: `user email verified successfully`,
    });
  } catch (error) {
    console.warn(`🔴 [AUTH_VERIFICATION_FAILED] can'tverify email right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};

//  get logged in user controller ⚙️

export const getCurrentUser = async (req, res) => {
  try {
    const { user } = req.user;

    console.log(`✅ get the logged in user`);
    return res.status(200).json({
      success: true,
      message: `verify user`,
      data: {
        user_id: user._id,
        user_avatar: user.avatar,
        full_name: user.name,
        email_address: user.email,
        phone_number: user.phone,
        user_address: user.address,
        cart_items: user.cart,
      },
    });
  } catch (error) {
    console.warn(`🔴 [AUTH_GET_USER] can't get logged in user right now.`);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Ooops! Internal server error 🛜.`,
    });
  }
};
