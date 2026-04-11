import User from "../models/User";
import jwt from "jsonwebtoken";


export const authMiddleware = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // get token from header or cookie
        if(token && req.headers.authorization.startsWith("Bearer")) {
            token = token.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, No token found!"
            })
        }

        // Varify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Get user from token
        const user = await User.findById(decoded.id).select("-password");

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, Invalid token!"
        })
    }
}