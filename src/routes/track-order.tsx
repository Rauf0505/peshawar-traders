import { createFileRoute } from "@tanstack/react-router";
import { TrackOrderPage } from "@/pages/TrackOrderPage";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Peshawar Traders" },
      { name: "description", content: "Track your order with Leopard Courier, M&P Logistics, TCS Express, or Trax — all in one place." },
    ],
  }),
  component: TrackOrderPage,
});
