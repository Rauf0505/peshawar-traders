import { createFileRoute } from "@tanstack/react-router";
import { BrandsPage } from "@/pages/BrandsPage";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Peshawar Traders" },
      { name: "description", content: "Explore premium airgun brands from Turkey, Spain, China and more." },
    ],
  }),
  component: BrandsPage,
});
