import User from "../models/User";



export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user existing
        const existingUser = await User.findUnique({
            where: { email }
        });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        // create new user
        const user = await User.create({
            name,
            email,
            password
        });
        if(!user) {
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
        console.log("Error while signingUp user!", error);
        return res.status(400).json({
            success: false,
            message: "Error while creating user!"
        })
    }
}


export const loginUser = (req, res) => {

};


export const getProfile = (req, res) => {

}

export const deleteUser = (req, res) => {

}