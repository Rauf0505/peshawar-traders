import { useEffect, useState } from "react";
import {
  getHomeAssignments,
  reorderHomeAssignments,
} from "@/lib/api/home-assignments.server";
import { getProducts } from "@/lib/api/products.server";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

const tabs = [
  { slug: "all", label: "All" },
  { slug: "weapons", label: "Weapons" },
  { slug: "optics", label: "Optics" },
  { slug: "apparel", label: "Apparel" },
  { slug: "tools", label: "Tools" },
];

export function HomeControlPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [prods, assigns] = await Promise.all([
      getProducts(),
      getHomeAssignments(),
    ]);
    setProducts(prods);
    setAssignments(assigns);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignedIds: number[] = (assignments[activeTab] || []).map((a: any) => a.product_id);
  const assignedProducts = assignedIds
    .map((id) => products.find((p: any) => p.id === id))
    .filter(Boolean);

  const availableProducts = products.filter(
    (p: any) => !assignedIds.includes(p.id),
  );

  const handleAdd = async (productId: number) => {
    const current = assignments[activeTab] || [];
    const newPos = current.length + 1;
    const newIds = [...assignedIds, productId];
    try {
      await reorderHomeAssignments({ data: { token: getToken(), tabSlug: activeTab, productIds: newIds } });
      await fetchData();
    } catch {
      alert("Failed to add. Check your login.");
    }
  };

  const handleRemove = async (productId: number) => {
    const newIds = assignedIds.filter((id) => id !== productId);
    try {
      await reorderHomeAssignments({ data: { token: getToken(), tabSlug: activeTab, productIds: newIds } });
      await fetchData();
    } catch {
      alert("Failed to remove.");
    }
  };

  const handlePositionChange = async (productId: number, newPos: number) => {
    const ids = [...assignedIds];
    const idx = ids.indexOf(productId);
    if (idx === -1) return;
    ids.splice(idx, 1);
    const clampedPos = Math.max(0, Math.min(newPos - 1, ids.length));
    ids.splice(clampedPos, 0, productId);
    try {
      await reorderHomeAssignments({ data: { token: getToken(), tabSlug: activeTab, productIds: ids } });
      await fetchData();
    } catch {
      alert("Reorder failed.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-display font-medium mb-1">Home Page Control</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Assign products to each home page tab. Position determines display order.
      </p>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-md transition ${
              activeTab === tab.slug
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
              Available Products ({availableProducts.length})
            </h2>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
              {availableProducts.length === 0 ? (
                <p className="text-sm text-zinc-600">All products are assigned to this tab.</p>
              ) : (
                availableProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.images?.[0] || ""}
                        alt=""
                        className="h-8 w-8 rounded object-cover bg-zinc-800 shrink-0"
                      />
                      <span className="text-sm truncate">{p.name}</span>
                    </div>
                    <button
                      onClick={() => handleAdd(p.id)}
                      className="shrink-0 text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition"
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
              Assigned Products ({assignedProducts.length})
            </h2>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
              {assignedProducts.length === 0 ? (
                <p className="text-sm text-zinc-600">No products assigned to this tab.</p>
              ) : (
                assignedProducts.map((p: any, index: number) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-zinc-500 w-5 shrink-0 text-right">
                        {index + 1}.
                      </span>
                      <img
                        src={p.images?.[0] || ""}
                        alt=""
                        className="h-8 w-8 rounded object-cover bg-zinc-800 shrink-0"
                      />
                      <span className="text-sm truncate">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={1}
                        max={assignedProducts.length}
                        value={index + 1}
                        onChange={(e) => handlePositionChange(p.id, Number(e.target.value))}
                        className="w-12 h-7 px-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-center focus:outline-none focus:border-emerald-500 transition"
                      />
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="text-xs px-2 py-1 bg-red-600/50 hover:bg-red-600 text-red-200 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
