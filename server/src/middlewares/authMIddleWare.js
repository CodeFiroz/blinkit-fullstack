import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
    try {

        const authToken = req.cookies.authToken;

        if (!authToken) {
            console.warn(`🔴 [UNAUTHORIZED] can't get authToken cookie.`);
            console.error(error);
            return res.status(401).json({
                success: false,
                message: `Unauthorized - no token found.`
            });
        }

        const decode = jwt.verify(authToken, process.env.JWT_SECRET);

        if (!decode) {
            console.warn(`🔴 [INVAILID_TOKEN] can't decode auth token.`);
            return res.status(401).json({
                success: false,
                message: `Unauthorized - Invalid token. can't verify.`
            });
        }

        const user_id = decode.userId;

        const findUser = await User.findById(user_id);

        if (!findUser) {
            console.warn(`🔴 [USER_NOT_FOUND] user doesn't exist.`);
            return res.status(400).json({
                success: false,
                message: `Invalid token. user not found.`
            });
        }

        req.user = findUser;

        next();

    } catch (error) {
        console.warn(`🔴 [AUTH_MIDDLEWARE] can't get user right now.`);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Ooops! Internal server error 🛜.`
        });
    }
}