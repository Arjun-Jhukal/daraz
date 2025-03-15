import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("Environment variables are not set properly.");
        }
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    } catch (error: any) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

export default connectDB;