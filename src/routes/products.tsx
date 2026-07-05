import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/pages/ProductsPage";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  country: z.string().optional(),
  q: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Products — Peshawar Traders" },
      { name: "description", content: "Browse all tactical and outdoor products filtered by category, brand, and country." },
    ],
  }),
  component: ProductsPage,
});
