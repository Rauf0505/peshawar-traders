import { createFileRoute } from "@tanstack/react-router";
import { getBrands } from "@/lib/api/brands.server";
import { BrandsPage } from "@/pages/BrandsPage";

export const Route = createFileRoute("/brands/")({
  loader: async () => {
    const brands = await getBrands();
    return { brands };
  },
  head: () => ({
    meta: [
      { title: "Brands — Peshawar Traders" },
      { name: "description", content: "Explore premium airgun brands from Turkey, Spain, China and more." },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { brands } = Route.useLoaderData();
  return <BrandsPage brands={brands} />;
}
