import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/pages/CartPage";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Peshawar Traders" },
      { name: "description", content: "View and manage your shopping cart." },
    ],
  }),
  component: CartPage,
});
