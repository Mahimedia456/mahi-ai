export function optionalAuth(req, _res, next) {
  req.user = req.user || null;
  next();
}