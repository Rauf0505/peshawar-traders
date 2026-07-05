import { createFileRoute } from "@tanstack/react-router";
import { BrandPage } from "@/pages/BrandPage";

export const Route = createFileRoute("/brands/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${name} — Peshawar Traders` },
        { name: "description", content: `Explore ${name} products at Peshawar Traders.` },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <BrandPage slug={slug} />;
}
