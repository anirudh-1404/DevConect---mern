import mongoose from "mongoose";
import "dotenv/config";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to database");
  } catch (err) {
    console.log("error connecting to database");
  }
};

export default db;
