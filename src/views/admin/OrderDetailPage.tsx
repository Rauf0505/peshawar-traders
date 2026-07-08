"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/lib/api-client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-300",
  confirmed: "bg-blue-900/50 text-blue-300",
  shipped: "bg-purple-900/50 text-purple-300",
  delivered: "bg-emerald-900/50 text-emerald-300",
  cancelled: "bg-red-900/50 text-red-300",
};

const statusFlow = ["pending", "confirmed", "shipped", "delivered"] as const;

export function OrderDetailPage({ orderId }: { orderId: number }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const load = () => {
    setLoading(true);
    getOrderById({ data: { token: getToken(), id: orderId } })
      .then(setOrder)
      .catch(() => {
        toast.error("Order not found");
        router.push("/admin/orders");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [orderId]);

  const handleStatusChange = async (status: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus({ data: { token: getToken(), id: orderId, status: status as any } });
      toast.success(`Order marked as ${status}`);
      load();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!order) return null;

  const nextStatus = statusFlow.find((s) => s === order.status)
    ? statusFlow[statusFlow.indexOf(order.status) + 1]
    : null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-display font-medium">
            Order <span className="font-mono text-emerald-400">{order.orderNumber}</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
          </p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full capitalize ${statusColors[order.status] || ""}`}>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Customer Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Name</dt>
              <dd className="text-zinc-100 font-medium">{order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Email</dt>
              <dd className="text-zinc-100">{order.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Phone</dt>
              <dd className="text-zinc-100">{order.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Shipping & Payment</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Address</dt>
              <dd className="text-zinc-100 text-right max-w-[200px]">{order.address}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">City</dt>
              <dd className="text-zinc-100">{order.city}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Payment</dt>
              <dd className="text-zinc-100 capitalize">
                {order.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Cash on Delivery"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Total</dt>
              <dd className="text-zinc-100 font-semibold">Rs.{order.total}</dd>
            </div>
          </dl>
        </div>
      </div>

      {order.notes && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-8">
          <h3 className="text-sm font-semibold text-zinc-100 mb-2">Order Notes</h3>
          <p className="text-sm text-zinc-400">{order.notes}</p>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-500 uppercase tracking-wider text-[11px]">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-zinc-800/50">
                <td className="px-4 py-3 text-zinc-100">{item.productName}</td>
                <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{item.productSku}</td>
                <td className="px-4 py-3 text-zinc-400">{item.quantity}</td>
                <td className="px-4 py-3 text-zinc-400">Rs.{item.unitPrice}</td>
                <td className="px-4 py-3 text-right text-zinc-100 font-medium">Rs.{item.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-zinc-100 mb-3">Update Status</h3>
        <div className="flex flex-wrap items-center gap-2">
          {statusFlow.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={updating || order.status === s || (order.status === "cancelled")}
              className={`px-4 py-2 text-xs rounded-md capitalize transition ${
                order.status === s
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {s}
            </button>
          ))}
          <span className="text-zinc-600 mx-1">|</span>
          <button
            onClick={() => handleStatusChange("cancelled")}
            disabled={updating || order.status === "cancelled" || order.status === "delivered"}
            className="px-4 py-2 text-xs rounded-md bg-red-900/50 text-red-300 hover:bg-red-800/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}
