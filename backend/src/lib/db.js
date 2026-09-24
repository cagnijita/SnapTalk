import mongoose from "mongoose";
import {env} from "./env.js";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = env;
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