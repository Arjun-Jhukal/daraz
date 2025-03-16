import { NextFunction, Request, Response } from "express";
import userModel from "../../models/userModel";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../../utils/helper";



export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const profile = req.file;

        if (!name) {
            return res.status(400).json({ field: "name", message: "Name is required." });
        }
        if (!email) {
            return res.status(400).json({ field: "email", message: "Email is required." });
        }
        if (!phoneNumber) {
            return res.status(400).json({ field: "phoneNumber", message: "Phone number is required." });
        }
        if (!password) {
            return res.status(400).json({ field: "password", message: "Password is required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ field: "email", message: "Invalid email format." });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ status: "error", message: "Email already exists." });
        }

        await userModel.insertOne({ email, phoneNumber, name, password, profile: profile ? { filename: profile.filename, size: profile.size, mimetype: profile.mimetype } : null })

        return res.status(201).json({ status: "success", message: "User registered successfully." });

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ field: "email", message: "Email is required." });
        }
        if (!password) {
            return res.status(400).json({ field: "password", message: "Password is required." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found." });
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "3m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "3h" }
        );

        user.refreshToken = refreshToken;


        return res.status(200).json({
            status: "success",
            message: "User logged in successfully.",
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        });


    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};



export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ field: "email", message: "Email is required." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        return res.status(200).json({ status: "success", message: "Email is verified." });

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ field: "email", message: "Email is required." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 2);

        // Store the reset code and expiry time in the database
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = expiresAt;
        await user.save();

        return res.status(200).json({ status: "success", message: "OTP sent to email.", code: resetCode });

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const verifyResetCodeAndChangePassword = async (req: Request, res: Response) => {
    try {
        const { email, resetCode, password } = req.body;

        if (!email || !resetCode) {
            return res.status(400).json({ message: "Email and reset code are required." });
        }

        const user = await userModel.findOne({ email });

        if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        // Check if the reset code is expired
        if (new Date() > user.resetPasswordExpires) {
            return res.status(400).json({ message: "Reset code has expired." });
        }

        if (user.resetPasswordToken !== resetCode) {
            return res.status(400).json({ message: "Incorrect reset code." });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ message: "Access token is required." });
//     }

//     jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid or expired access token." });
//         }

//         req.user = decoded;
//         next();
//     });
// };


export const logoutUser = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ status: "success", message: "User logged out successfully." });
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}