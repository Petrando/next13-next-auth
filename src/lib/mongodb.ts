
import { MongoClient } from 'mongodb';

// Type for the global object to store the MongoClient promise in development
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient>;
}

const uri: string = process.env.MONGODB_URI as string;

if (!uri) {
    throw new Error('Add Mongo URI to .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the MongoClient instance
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

// Export the client promise
export default clientPromise;

/*
import mongoose from "mongoose";

export const connectMongoDB = async () => {
    const dbURI = process.env.MONGODB_URI || ""
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to Mongo ATLAS")        
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
};*/