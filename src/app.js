import express from "express";
import cors from "cors";

import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productVariantRoutes from "./routes/productVariantRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import voucherRoutes from "./routes/voucherRoutes.js";

import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminBrandRoutes from "./routes/adminBrandRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminProductVariantRoutes from "./routes/adminProductVariantRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminVoucherRoutes from "./routes/adminVoucherRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// ======================================================
// USER API
// ======================================================

// Đăng ký - Đăng nhập - Hồ sơ
app.use("/api/users", userRoutes);

// Brand
app.use("/api/brands", brandRoutes);

// Category
app.use("/api/categories", categoryRoutes);

// Product
app.use("/api/products", productRoutes);

// Product Variant
app.use("/api/product-variants", productVariantRoutes);

// Order
app.use("/api/orders", orderRoutes);

// Address
app.use("/api/addresses", addressRoutes);

// Favorite
app.use("/api/favorites", favoriteRoutes);

// Payment
app.use("/api/payment", paymentRoutes);

// Notification
app.use("/api/notifications", notificationRoutes);

// Review
app.use("/api/reviews", reviewRoutes);

// Voucher
app.use("/api/vouchers", voucherRoutes);

// ======================================================
// ADMIN API
// ======================================================

// User
app.use("/api/admin/users", adminUserRoutes);

// Brand
app.use("/api/admin/brands", adminBrandRoutes);

// Category
app.use("/api/admin/categories", adminCategoryRoutes);

// Product
app.use("/api/admin/products", adminProductRoutes);

// Product Variant
app.use("/api/admin/product-variants", adminProductVariantRoutes);

// Order
app.use("/api/admin/orders", adminOrderRoutes);

// Voucher
app.use("/api/admin/vouchers", adminVoucherRoutes);

// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome ShoeStore API",
  });
});

// ======================================================
// ERROR MIDDLEWARE
// ======================================================

app.use(errorMiddleware);

export default app;
