import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
  {
    storeOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const StoreSettings =
  mongoose.models.StoreSettings ||
  mongoose.model("StoreSettings", storeSettingsSchema);
