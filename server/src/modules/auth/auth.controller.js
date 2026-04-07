import * as authService from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;
    const data = await authService.registerUser({ fullName, email, password });

    return successResponse(
      res,
      "Registration successful. Verification code sent to your email.",
      {
        userId: data.user.id,
        email: data.user.email,
        otpPreview: process.env.NODE_ENV === "development" ? data.code : undefined
      },
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}

export async function verifyRegisterOtp(req, res) {
  try {
    const { email, code } = req.body;
    const user = await authService.verifyRegisterOtp({ email, code });
    return successResponse(res, "Account verified successfully", { user });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });
    return successResponse(res, "Login successful", data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}

export async function me(req, res) {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, "Profile fetched successfully", { user });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const data = await authService.forgotPassword({ email });
    return successResponse(
      res,
      "Reset code sent to your email.",
      {
        email: data.email,
        otpPreview: process.env.NODE_ENV === "development" ? data.code : undefined
      }
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}

export async function verifyForgotOtp(req, res) {
  try {
    const { email, code } = req.body;
    const data = await authService.verifyForgotOtp({ email, code });
    return successResponse(res, "OTP verified successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, password } = req.body;
    const data = await authService.resetPassword({ email, password });
    return successResponse(res, "Password reset successful", data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
}