import express from "express";
import cors from "cors";

import brandRoutes from "./routes/brandRoutes.js";
import adminBrandRoutes from "./routes/adminBrandRoutes.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";

import productVariantRoutes from "./routes/productVariantRoutes.js";
import adminProductVariantRoutes from "./routes/adminProductVariantRoutes.js";

import authRoutes from "./routes/authRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ======================================================
// USER API
// ======================================================

// Brand
app.use("/api/brands", brandRoutes);

// Category
app.use("/api/categories", categoryRoutes);

// Product
app.use("/api/products", productRoutes);

// Product Variant
app.use("/api/product-variants", productVariantRoutes);

// ======================================================
// ADMIN API
// ======================================================

// Brand
app.use("/api/admin/brands", adminBrandRoutes);

// Category
app.use("/api/admin/categories", adminCategoryRoutes);

// Product
app.use("/api/admin/products", adminProductRoutes);

// Product Variant
app.use(
  "/api/admin/product-variants",
  adminProductVariantRoutes
);

// ======================================================
// AUTH
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome ShoeStore API",
  });
});

// ======================================================
// ERROR MIDDLEWARE
// ======================================================

app.use(errorMiddleware);

export default app;