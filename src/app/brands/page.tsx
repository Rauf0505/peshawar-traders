import { getBrands } from "@/lib/api/brands.server";
import { BrandsPage } from "@/views/BrandsPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brands — Peshawar Traders",
  description: "Explore premium airgun brands from Turkey, Spain, China and more.",
};

export default async function BrandsListPage() {
  const brands = await getBrands();
  return <BrandsPage brands={brands} />;
}
