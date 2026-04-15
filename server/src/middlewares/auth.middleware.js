import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    const queryToken =
      typeof req.query?.token === "string" ? req.query.token.trim() : null;

    const token = bearerToken || queryToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret);

    req.user = {
      id: decoded.id || decoded.userId || null,
      userId: decoded.userId || decoded.id || null,
      email: decoded.email || null,
      fullName: decoded.fullName || decoded.name || null,
      role: decoded.role || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}