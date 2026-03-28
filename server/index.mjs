import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.mjs";
import { productRouter } from "./routes/products.mjs";
import { storeRouter } from "./routes/store.mjs";
import { seedIfEmpty } from "./seed.mjs";

const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Defina MONGODB_URI no arquivo .env");
  process.exit(1);
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/store", storeRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("[mongo] Conectado ao Atlas");
  await seedIfEmpty();

  app.listen(PORT, () => {
    console.log(`[api] http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
