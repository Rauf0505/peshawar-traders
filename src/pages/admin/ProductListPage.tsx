import { useEffect, useState, Suspense } from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { getProducts, deleteProduct } from "@/lib/api/products.server";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function ProductListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const location = useLocation();
  const isChildRoute = location.pathname.startsWith("/admin/products/");

  if (isChildRoute) {
    return (
      <Suspense fallback={<div className="p-6 text-zinc-500 text-sm">Loading...</div>}>
        <Outlet />
      </Suspense>
    );
  }

  const perPage = 10;

  const load = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const handleDelete = (id: number, name: string) => setConfirmDelete({ id, name });

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.id);
    try {
      await deleteProduct({ data: { token: getToken(), id: confirmDelete.id } });
      toast.success("Product deleted successfully");
      load();
    } catch {
      toast.error("Delete failed. Make sure you're logged in.");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-display font-medium">Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full h-10 pl-10 pr-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm py-12 text-center">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <Tag className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm mb-4">No products yet. Add your first product to get started.</p>
          <Link to="/admin/products/new" className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-500 uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => (
                    <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || ""}
                            alt=""
                            className="h-10 w-10 rounded object-cover bg-zinc-800"
                          />
                          <span className="font-medium text-zinc-100">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{p.sku}</td>
                      <td className="px-4 py-3">Rs.{p.price}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            p.stockStatus === "In Stock"
                              ? "bg-emerald-900/50 text-emerald-300"
                              : p.stockStatus === "Out of Stock"
                                ? "bg-red-900/50 text-red-300"
                                : "bg-blue-900/50 text-blue-300"
                          }`}
                        >
                          {p.stockStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{p.categoryName}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to="/admin/products/$id/edit"
                            params={{ id: String(p.id) }}
                            className="p-2 hover:bg-zinc-800 rounded transition"
                          >
                            <Pencil className="h-4 w-4 text-zinc-400" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deleting === p.id}
                            className="p-2 hover:bg-zinc-800 rounded transition disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded hover:bg-zinc-800 disabled:opacity-30 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-zinc-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded hover:bg-zinc-800 disabled:opacity-30 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete product"
        description={`Delete product "${confirmDelete?.name}"?`}
        loading={deleting === confirmDelete?.id}
      />
    </div>
  );
}
