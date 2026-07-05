import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategories } from "@/lib/api/products.server";
import { CategoryPage } from "@/pages/CategoryPage";

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => {
    const slug = params.category;
    const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [{ title: `${name} — Peshawar Traders` }],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { category: categorySlug } = Route.useParams();
  return <CategoryPage categorySlug={categorySlug} />;
}
