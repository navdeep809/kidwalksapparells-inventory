import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTES
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import customerRoutes from "./routes/customerRoutes";
import orderRoutes from "./routes/orderRoutes";
import purchaseRoutes from "./routes/purchaseRoutes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Route bindings
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
// app.use("/dashboard", dashboardRoutes);
app.use("/expenses", expenseRoutes);
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/statistics", statisticsRoutes);

const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
