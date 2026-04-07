export function requireAdmin(req, res, next) {
  if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }

  next();
}