import express from "express";
import cors from "cors";

import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productVariantRoutes from "./routes/productVariantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome ShoeStore API",
  });
});

export default app;