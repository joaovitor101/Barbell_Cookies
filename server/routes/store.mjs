import { Router } from "express";
import { requireAdmin } from "../middleware/auth.mjs";
import { getOrCreateSettings } from "../lib/getSettings.mjs";

export const storeRouter = Router();

storeRouter.get("/status", async (_req, res) => {
  try {
    const doc = await getOrCreateSettings();
    res.json({ storeOpen: doc.storeOpen });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao ler status da loja" });
  }
});

storeRouter.patch("/settings", requireAdmin, async (req, res) => {
  try {
    const { storeOpen } = req.body || {};
    if (typeof storeOpen !== "boolean") {
      return res.status(400).json({ error: "storeOpen deve ser true ou false" });
    }
    const doc = await getOrCreateSettings();
    doc.storeOpen = storeOpen;
    await doc.save();
    res.json({ storeOpen: doc.storeOpen });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao salvar" });
  }
});
