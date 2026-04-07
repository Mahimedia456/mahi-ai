import { Router } from "express";
import * as authController from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-register-otp", authController.verifyRegisterOtp);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.me);

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-otp", authController.verifyForgotOtp);
router.post("/reset-password", authController.resetPassword);

export default router;