import User from "../models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all details!"
        })
    }

    try {
        // Check if user existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered!"
            })
        }



        return res.status(201).json({
            success: true,
            message: "User Registered Successfully!"
        })

    } catch (error) {
        console.log("Error while signing up user!", error);
        return res.status(400).json({
            success: false,
            message: "Error while signing up user!"
        })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all details!"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not registered, Please Create Account!"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password!"
            })
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '24h' })

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 Hours
        }

        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            success: true,
            message: "Login Successfully!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })


    } catch (error) {
        console.log("Error while logingIn user!", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error while logingIn user!",
            error: error
        })
    }

};

export const logOutUser = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true })

        res.status(200).json({
            success: true,
            message: "User logged out successfully!"
        })
    } catch (error) {
        console.log("Error while log out user!", error);
        return res.status(400).json({
            success: false,
            message: "Error while loggin out user!"
        })
    }
}

export const getProfile = async (req, res) => {

    if (!req.user.id) {
        return res.status(400).json({
            success: false,
            message: "User Id not found!"
        })
    }

    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log("Error while fetching profile", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Error while fetching user's profile",
            error: error
        })
    }
}

export const deleteUser = async (req, res) => {

    const userId = req.params.id;

    console.log(userId)

    try {
        const deleteUser = await User.findByIdAndDelete(userId);

        if (!deleteUser) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        })

    } catch (error) {
        console.log("Error while deleting user!", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Error while deleting user!",
        })
    }
}