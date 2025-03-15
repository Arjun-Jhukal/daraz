import { Document } from "mongoose";

export type UserRole = "customer" | "seller" | "admin";
export interface IUser extends Document {

    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    refreshToken: string;
    seller?: {
        id: number;
        store: string;
    }
}

