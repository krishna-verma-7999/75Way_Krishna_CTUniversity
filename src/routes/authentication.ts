import { register, login } from "../controllers/authentication";
import express from "express";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

export default router;
