import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const conn = await mongoose.connect(MONGO_URI)
        console.log("MongoDB connected successfully", conn.connection.host);
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
        process.exit(1);// status code 1 means failure and 0 means success
    }
}