import { StoreSettings } from "../models/StoreSettings.mjs";

export async function getOrCreateSettings() {
  let doc = await StoreSettings.findOne();
  if (!doc) {
    doc = await StoreSettings.create({ storeOpen: true });
  }
  return doc;
}
