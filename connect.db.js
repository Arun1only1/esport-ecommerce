import mongoose from "mongoose";

const userName = "arun";
const password = encodeURIComponent("arun2nly2");
const databaseName = "esports-ecommerce";

const dbURL = `mongodb+srv://${userName}:${password}@school.b6qkdnb.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("DB connection established...");
  } catch (error) {
    console.log(error.message);
    console.log("DB connection failed...");
  }
};

export default connectDB;
