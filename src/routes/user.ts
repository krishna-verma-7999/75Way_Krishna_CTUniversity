import express from "express";
import {
  checkoutTime,
  createUserController,
  getAllUsersController,
  getCheckoutDetails,
  getUserController,
} from "../controllers/user";

import { isAuthenticated, isAdmin, isOwner, isUser } from "../middleware";

const router = express.Router();

router.post("/create-user", isAuthenticated, isAdmin, createUserController);
router.get("/getAllUsers", isAuthenticated, isAdmin, getAllUsersController);
router.get("/getUser/:userId", isAuthenticated, isAdmin, getUserController);

router.post(
  "/CheckoutTime/:userId",
  isAuthenticated,
  isUser,
  isOwner,
  checkoutTime
);

router.get(
  "/CheckoutTime/:userId",
  isAuthenticated,
  isUser,
  isOwner,
  getCheckoutDetails
);

export default router;
