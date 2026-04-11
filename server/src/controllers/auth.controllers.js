import User from "../models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"


// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
    );
};

// Cookie Options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
};

// Signup User
// POST: /api/v1/auth/signup
export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all details!"
        })
    }

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format!"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check if user existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

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

        const token = generateToken(user);

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
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


// Login User
// POST: /api/v1/auth/login
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details!"
            })
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not registered, Please Create Account!"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password!"
            })
        }

        const token = generateToken(user);

        res.cookie("token", token, cookieOptions);

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


// Log Out User
// POST: /api/v1/auth/logout
export const logOutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })

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


// Get User Profile
// GET: /api/v1/auth/profile/:id
export const getProfile = async (req, res) => {

    try {

        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                message: "User Id not found!"
            })
        }

        const user = await User.findById(req.user._id).select("-password");

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

// Delete User
// DELETE: /api/v1/auth/delete/:id
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Authorization check
        if (!req.user || req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this user"
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting user"
        });
    }
};