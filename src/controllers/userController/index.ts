import { Request, Response } from "express";
import userModel from "../../models/userModel";
import { sanitizeUser } from "../../utils/helper";

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        const { id, newRole } = req.body;

        if (!id) {
            return res.status(404).json({
                message: "User id is missing",
            })
        }

        const user = await userModel.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.role = newRole;

        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            message: "User role updated successfully",
            user: userWithoutPassword,
        });

    }
    catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const allUser = await userModel.find();

        return res.status(200).json({
            message: "User fetched successfully",
            data: {
                user: allUser.map((user) => sanitizeUser(user))
            }
        });
    }
    catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
export const getUserByEmailOrId = async (req: Request, res: Response) => {
    try {
        const { email, id } = req.query;

        let user;
        if (email) {

            user = await userModel.findOne({ email });
        }
        else if (id) {
            user = await userModel.findOne({ _id: id });

        }
        else {
            return res.status(400).json({
                message: "Email or ID is required"
            });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: sanitizeUser(user)
        });
    }
    catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });
    }
    catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

