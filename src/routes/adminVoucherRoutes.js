import express from "express";

import {
  getAdminVouchers,
  getAdminVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  changeVoucherStatus,
} from "../controllers/adminVoucherController.js";

const router = express.Router();

router.get("/", getAdminVouchers);

router.get("/:id", getAdminVoucherById);

router.post("/", createVoucher);

router.put("/:id", updateVoucher);

router.delete("/:id", deleteVoucher);

router.patch("/:id/status", changeVoucherStatus);

export default router;