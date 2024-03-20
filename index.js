import express from "express";
import connectDB from "./connect.db.js";
import userRoutes from "./src/user/user.route.js";

const app = express();

// to make app understand json
app.use(express.json());

// connect database
connectDB();

// register routes
app.use(userRoutes);

// network port and server
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
