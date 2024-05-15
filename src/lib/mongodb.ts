import mongoose from "mongoose";

export const connectMongoDB = async () => {
    const dbURI = process.env.MONGODB_URI || ""
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to Mongo ATLAS")        
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
};