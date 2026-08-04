import express from "express";

import {
  getVouchers,
  validateVoucher,
} from "../controllers/voucherController.js";

const router = express.Router();

// lấy danh sách voucher
router.get("/", getVouchers);

// kiểm tra voucher
router.post("/validate", validateVoucher);

export default router;