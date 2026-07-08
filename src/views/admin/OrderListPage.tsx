"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/lib/api-client";
import { Search, Package } from "lucide-react";

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

export function OrderListPage() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getOrders({ data: { token: getToken() } })
      .then(setOrderList)
      .catch(() => setOrderList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = orderList.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-display font-medium">Orders</h1>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm py-12 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <Package className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-500 uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">{o.customerName}</div>
                    <div className="text-xs text-zinc-500">{o.email}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-100">Rs.{o.total}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400 capitalize">
                    {o.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Cash on Delivery"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[o.status] || ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
