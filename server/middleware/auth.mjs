export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  const token =
    auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const headerToken = req.headers["x-admin-token"];
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || (!token && !headerToken)) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  if (token !== expected && headerToken !== expected) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  next();
}
