const adminMiddleware = (req, res, next) => {
  // Ensure that req.user exists (authMiddleware must run first)
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admin privileges required." });
  }
  next();
};

module.exports = adminMiddleware;
