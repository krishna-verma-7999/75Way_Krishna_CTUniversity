import express from "express";
import { isAdmin, isAuthenticated } from "../middleware";
import { updateUserStatus } from "../controllers/admin";

const router = express.Router();

router.patch(
  "/admin/updateStatus/:checkoutId",
  isAuthenticated,
  isAdmin,
  updateUserStatus
);

export default router;
