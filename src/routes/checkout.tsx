import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/pages/CheckoutPage";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Peshawar Traders" },
      { name: "description", content: "Complete your order." },
    ],
  }),
  component: CheckoutPage,
});
