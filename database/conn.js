import mongoose from "mongoose";
import ENV from '../config.env'

export default async function connect () {
  const db = await mongoose.connect(ENV.URL);

  if (mongoose.connection.readyState === 1) {
    console.log("Dabaase is connected");
    return;
  }
  console.log("Database is connected");
}