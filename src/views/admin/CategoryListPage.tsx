"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { getCategories, deleteCategory } from "@/lib/api-client";
import { Plus, Pencil, Trash2, Grid3X3 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function CategoryListPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const load = () => {
    setLoading(true);
    getCategories().then((c) => { setCategories(c); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, name: string) => setConfirmDelete({ id, name });

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.id);
    try {
      await deleteCategory({ data: { token: getToken(), id: confirmDelete.id } });
      toast.success("Category deleted successfully");
      load();
    } catch {
      toast.error("Delete failed. Make sure you're logged in.");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const toggleStatus = async (cat: any) => {
    const { updateCategory } = await import("@/lib/api-client");
    try {
      await updateCategory({
        data: {
          token: getToken(),
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || "",
          displayOrder: cat.displayOrder || 0,
          status: cat.status === 1 ? 0 : 1,
        },
      });
      toast.success(`Category "${cat.name}" ${cat.status === 1 ? "disabled" : "activated"}`);
      load();
    } catch {
      toast.error("Status update failed. Make sure you're logged in.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-display font-medium text-zinc-100">Categories</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{categories.length} categor{categories.length !== 1 ? "ies" : "y"} registered</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm py-12 text-center">Loading…</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <Grid3X3 className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm mb-4">No categories yet. Add your first category to get started.</p>
          <Link href="/admin/categories/new" className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white">
            <Plus className="h-4 w-4" /> Add Category
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Order</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Products</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className={`border-b border-zinc-800/50 hover:bg-zinc-900/40 transition ${i % 2 === 0 ? "" : "bg-zinc-950/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center">
                        <Grid3X3 className="h-4 w-4 text-zinc-500" />
                      </div>
                      <span className="font-medium text-zinc-100">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-zinc-400">{cat.displayOrder}</td>
                  <td className="px-4 py-3 text-zinc-400">{cat.productCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(cat)}
                      className={`text-xs px-2 py-0.5 rounded-full transition ${
                        cat.status === 1
                          ? "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70"
                          : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                      }`}
                    >
                      {cat.status === 1 ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deleting === cat.id}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-red-950/60 text-zinc-500 hover:text-red-400 transition disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete category"
        description={`Delete category "${confirmDelete?.name}"? Products will be uncategorized.`}
        loading={deleting === confirmDelete?.id}
      />
    </div>
  );
}
