import { useEffect, useRef, useState } from "react";
import {
  getHomeAssignments,
  reorderHomeAssignments,
} from "@/lib/api/home-assignments.server";
import { getProducts } from "@/lib/api/products.server";
import { GripVertical, Plus, X, Search, Loader2 } from "lucide-react";

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
  const [search, setSearch] = useState("");

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [prods, assigns] = await Promise.all([getProducts(), getHomeAssignments()]);
    setProducts(prods);
    setAssignments(assigns);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Reset search when tab changes
  useEffect(() => { setSearch(""); }, [activeTab]);

  const assignedIds: number[] = (assignments[activeTab] || []).map((a: any) => a.productId);
  const assignedProducts = assignedIds
    .map((id) => products.find((p: any) => p.id === id))
    .filter(Boolean);

  const availableProducts = products.filter(
    (p: any) => !assignedIds.includes(p.id) &&
      (!search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase()))
  );

  const persist = async (newIds: number[]) => {
    setSaving(true);
    try {
      await reorderHomeAssignments({ data: { token: getToken(), tabSlug: activeTab, productIds: newIds } });
      await fetchData();
    } catch {
      alert("Operation failed. Please check your login.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = (productId: number) => {
    persist([...assignedIds, productId]);
  };

  const handleRemove = (productId: number) => {
    persist(assignedIds.filter((id) => id !== productId));
  };

  // ── Drag handlers ──────────────────────────────────────────
  const onDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const onDragEnter = (index: number) => {
    setDragOver(index);
  };

  const onDragEnd = () => {
    const from = dragIndex.current;
    const to = dragOver;
    if (from === null || to === null || from === to) {
      dragIndex.current = null;
      setDragOver(null);
      return;
    }
    const newIds = [...assignedIds];
    const [moved] = newIds.splice(from, 1);
    newIds.splice(to, 0, moved);
    dragIndex.current = null;
    setDragOver(null);
    persist(newIds);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-display font-semibold">Home Page Control</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage which products appear on each homepage tab. Drag assigned cards to reorder.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] rounded-md font-semibold transition ${activeTab === tab.slug
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
        {saving && (
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 ml-2 self-center">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading products…
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* ── LEFT: Assigned products drag-and-drop grid ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                Assigned Products
                <span className="ml-2 text-zinc-600 normal-case tracking-normal font-normal">
                  ({assignedProducts.length})
                </span>
              </h2>
              <span className="text-[10px] text-zinc-600">Drag to reorder</span>
            </div>

            {assignedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-zinc-900 border border-dashed border-zinc-700 rounded-xl text-zinc-600 text-sm">
                <p>No products assigned to this tab yet.</p>
                <p className="text-xs mt-1 text-zinc-700">Add products from the panel on the right →</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                onDragOver={(e) => e.preventDefault()}
              >
                {assignedProducts.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragEnter={() => onDragEnter(i)}
                    onDragEnd={onDragEnd}
                    className={`relative group flex flex-col bg-zinc-900 border rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-150 ${dragOver === i
                        ? "border-emerald-500 ring-1 ring-emerald-500/40 scale-[0.98]"
                        : "border-zinc-800 hover:border-zinc-600"
                      }`}
                  >
                    {/* Position badge */}
                    <div className="absolute top-2 left-2 z-10 h-5 w-5 rounded bg-black/60 text-[10px] font-bold text-zinc-400 grid place-items-center">
                      {i + 1}
                    </div>

                    {/* Drag handle */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition">
                      <GripVertical className="h-4 w-4 text-zinc-400" />
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="absolute bottom-2 right-2 z-10 h-6 w-6 rounded-full bg-red-600/80 hover:bg-red-600 grid place-items-center opacity-0 group-hover:opacity-100 transition"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5 text-white" />
                    </button>

                    {/* Product image */}
                    <div className="aspect-square bg-zinc-800 overflow-hidden">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover pointer-events-none"
                          draggable={false}
                        />
                      ) : (
                        <div className="h-full w-full bg-zinc-800" />
                      )}
                    </div>

                    {/* Product name */}
                    <div className="px-2.5 py-2">
                      <p className="text-xs text-zinc-300 leading-tight line-clamp-2">{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Available products with search ── */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                Available Products
                <span className="ml-2 text-zinc-600 normal-case tracking-normal font-normal">
                  ({availableProducts.length})
                </span>
              </h2>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full h-9 pl-9 pr-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-600 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {availableProducts.length === 0 ? (
                <p className="text-sm text-zinc-600 py-6 text-center">
                  {search ? `No products matching "${search}"` : "All products are already assigned."}
                </p>
              ) : (
                availableProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition group"
                  >
                    <img
                      src={p.images?.[0] || ""}
                      alt=""
                      className="h-9 w-9 rounded object-cover bg-zinc-800 shrink-0"
                    />
                    <span className="text-sm text-zinc-300 truncate flex-1 min-w-0">{p.name}</span>
                    <button
                      onClick={() => handleAdd(p.id)}
                      className="shrink-0 h-7 w-7 rounded-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/40 hover:border-emerald-600 grid place-items-center transition"
                      title="Add to tab"
                    >
                      <Plus className="h-3.5 w-3.5 text-emerald-400 group-hover:text-white transition" />
                    </button>
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
