import mongoose from 'mongoose';

export const connectDB=async()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully", conn.connection.host);
    }
    catch(err){
        console.error("Error connecting to database", err.message);
        process.exit(1); //1 means exit with failure, and 0 means exit with success
    }
}