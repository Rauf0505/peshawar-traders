"use client";

import { useParams } from "next/navigation";
import { OrderDetailPage } from "@/views/admin/OrderDetailPage";

export default function AdminOrderDetail() {
  const params = useParams();
  return <OrderDetailPage orderId={Number(params.id)} />;
}
