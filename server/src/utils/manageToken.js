import jwt from "jsonwebtoken";

export const genrateToken = (res, userid)=>{
    try {

        const token  = jwt.sign({userid}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie("authToken", token, {
             maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: process.env.NODE_ENV !== "development",
            sameSite: "Strict",
            secure: process.env.NODE_ENV !== "development",
        })
        
    } catch (error) {
        console.error(`[TOKEN_GENRATION] error while genrating token`);
        console.error(error);
        return false;        
    }
}