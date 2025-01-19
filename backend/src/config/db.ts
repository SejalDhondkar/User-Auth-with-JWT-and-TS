import mongoose from "mongoose";
import { MONGO_URL } from "../constants/env";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Successfully connected to database');
    } catch (error) {
        console.log('Error connecting to database: ', error);
        process.exit(1);
    }
}

export default connectToDatabase;