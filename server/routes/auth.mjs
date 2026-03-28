import { Router } from "express";
import { requireAdmin } from "../middleware/auth.mjs";

export const authRouter = Router();

authRouter.get("/verify", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

authRouter.post("/login", (req, res) => {
  const { password } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res
      .status(500)
      .json({ error: "ADMIN_PASSWORD não configurado no servidor" });
  }
  if (!password || password !== expected) {
    return res.status(401).json({ error: "Senha incorreta" });
  }
  return res.json({ ok: true });
});
