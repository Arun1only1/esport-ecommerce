import mongoose from "mongoose";

const userName = "arun";
const password = encodeURIComponent("arun3nly3");
const databaseName = "esports-ecommerce";
const databaseHost = "school.b6qkdnb.mongodb.net";

const dbURL = `mongodb+srv://${userName}:${password}@${databaseHost}/${databaseName}?retryWrites=true&w=majority`;

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
