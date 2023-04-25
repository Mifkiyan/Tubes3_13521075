import mongoose from "mongoose";
import ENV from '../config.env'

export default async function connect () {
  const db = await mongoose.connect(ENV.URL);

  if (mongoose.connection.readyState === 1) {
    return;
  }
  console.log("Database is connected");
}