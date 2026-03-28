import { Router } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product.mjs";
import { requireAdmin } from "../middleware/auth.mjs";

export const productRouter = Router();

function toClient(p) {
  return {
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    sortOrder: p.sortOrder ?? 0,
  };
}

productRouter.get("/", async (_req, res) => {
  try {
    const list = await Product.find().sort({ sortOrder: 1, name: 1 }).lean();
    res.json(list.map(toClient));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

productRouter.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, description, price, image, sortOrder } = req.body || {};
    if (!name || price == null || !image) {
      return res
        .status(400)
        .json({ error: "name, price e image são obrigatórios" });
    }
    const doc = await Product.create({
      name,
      description: description ?? "",
      price: Number(price),
      image,
      sortOrder: sortOrder != null ? Number(sortOrder) : 0,
    });
    res.status(201).json(toClient(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

productRouter.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const { name, description, price, image, sortOrder } = req.body || {};
    const update = {};
    if (name != null) update.name = name;
    if (description != null) update.description = description;
    if (price != null) update.price = Number(price);
    if (image != null) update.image = image;
    if (sortOrder != null) update.sortOrder = Number(sortOrder);

    const doc = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(toClient(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

productRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const doc = await Product.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Produto não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});
