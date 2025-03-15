import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interface/user";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "customer" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    seller: {
        id: { type: Number, unique: true },
        store: { type: Number, unique: true }
    }
})

/** HASH PASSWORD BEFORE SAVING */
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

export default mongoose.model<IUser>('User', userSchema);