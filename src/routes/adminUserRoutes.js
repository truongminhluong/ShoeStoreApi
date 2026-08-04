import express from "express";

import {
  getAdminUsers,
  getAdminUserById,
} from "../controllers/adminUserController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getAdminUsers);

router.get("/:id", protect, admin, getAdminUserById);

export default router;