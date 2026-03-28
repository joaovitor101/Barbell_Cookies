import { Product } from "./models/Product.mjs";

const INITIAL = [
  {
    name: "Tradicional (50g)",
    description: "Kits: 4 unid. - R$ 20 | 6 unid. - R$ 28",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1706167754899-36a714b5dc66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNob2NvbGF0ZSUyMGNvb2tpZXN8ZW58MXx8fHwxNzczNzkwNjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sortOrder: 0,
  },
  {
    name: "Red Velvet (50g)",
    description: "Kits: 4 unid. - R$ 24 | 6 unid. - R$ 33",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1673412810103-27c233f77da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB2ZWx2ZXQlMjBjb29raWVzfGVufDF8fHx8MTc3Mzc5MDYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sortOrder: 1,
  },
  {
    name: "Tradicional recheado com nutella (50g)",
    description: "Kits: 4 unid. - R$ 30 | 6 unid. - R$ 43",
    price: 7.99,
    image: "images/cookie_nutella.webp",
    sortOrder: 2,
  },
  {
    name: "Red velvet com nutella (50g)",
    description: "Kits: 4 unid. - R$ 30 | 6 unid. - R$ 43",
    price: 12.99,
    image: "images/red_velvet_nutella.jpg",
    sortOrder: 3,
  },
  {
    name: "Cookie Tradicional (100g)",
    description: "Kits: 4 unid. - R$ 40 | 6 unid. - R$ 58",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1706167754899-36a714b5dc66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNob2NvbGF0ZSUyMGNvb2tpZXN8ZW58MXx8fHwxNzczNzkwNjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sortOrder: 4,
  },
  {
    name: "Red Velvet (100g)",
    description: "Kits: 4 unid. - R$ 44 | 6 unid. - R$ 61",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1673412810103-27c233f77da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB2ZWx2ZXQlMjBjb29raWVzfGVufDF8fHx8MTc3Mzc5MDYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sortOrder: 5,
  },
  {
    name: "Tradicional recheado com nutella (100g)",
    description: "Kits: 4 unid. - R$ 56 | 6 unid. - R$ 82",
    price: 14.99,
    image: "images/cookie_nutella.webp",
    sortOrder: 6,
  },
  {
    name: "Red velvet com nutella (100g)",
    description: "Kits: 4 unid. - R$ 56 | 6 unid. - R$ 82",
    price: 14.99,
    image: "images/red_velvet_nutella.jpg",
    sortOrder: 7,
  },
];

export async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany(INITIAL);
  console.log("[seed] Catálogo inicial inserido no MongoDB.");
}
