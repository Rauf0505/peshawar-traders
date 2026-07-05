import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/pages/ShopPage";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Peshawar Traders" },
      { name: "description", content: "Browse our complete catalog of tactical and outdoor gear." },
    ],
  }),
  component: ShopPage,
});
