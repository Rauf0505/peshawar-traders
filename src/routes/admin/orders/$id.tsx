import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailPage } from "@/pages/admin/OrderDetailPage";

export const Route = createFileRoute("/admin/orders/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <OrderDetailPage orderId={Number(id)} />;
}
