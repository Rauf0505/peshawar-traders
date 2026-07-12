"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { getSubcategories, getCategories, deleteSubcategory } from "@/lib/api-client";
import { Plus, Pencil, Trash2, List } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function SubcategoryListPage() {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [filterCat, setFilterCat] = useState<number>(0);

  const load = () => {
    setLoading(true);
    Promise.all([getSubcategories(), getCategories()]).then(([subs, cats]) => {
      setSubcategories(subs);
      setCategories(cats);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, name: string) => setConfirmDelete({ id, name });

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.id);
    try {
      await deleteSubcategory({ data: { token: getToken(), id: confirmDelete.id } });
      toast.success("Subcategory deleted successfully");
      load();
    } catch {
      toast.error("Delete failed. Make sure you're logged in.");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const toggleStatus = async (sub: any) => {
    const { updateSubcategory } = await import("@/lib/api-client");
    try {
      await updateSubcategory({
        data: {
          token: getToken(),
          id: sub.id,
          categoryId: sub.categoryId,
          name: sub.name,
          slug: sub.slug,
          description: sub.description || "",
          displayOrder: sub.displayOrder || 0,
          status: sub.status === 1 ? 0 : 1,
        },
      });
      toast.success(`Subcategory "${sub.name}" ${sub.status === 1 ? "disabled" : "activated"}`);
      load();
    } catch {
      toast.error("Status update failed. Make sure you're logged in.");
    }
  };

  const filtered = filterCat
    ? subcategories.filter((s) => s.categoryId === filterCat)
    : subcategories;

  const catName = (id: number) => categories.find((c) => c.id === id)?.name ?? "Unknown";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-display font-medium text-zinc-100">Subcategories</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{subcategories.length} subcategor{subcategories.length !== 1 ? "ies" : "y"} registered</p>
        </div>
        <Link
          href="/admin/subcategories/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
        >
          <Plus className="h-4 w-4" />
          Add Subcategory
        </Link>
      </div>

      <div className="relative max-w-xs mb-4">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(Number(e.target.value))}
          className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
        >
          <option value={0}>All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm py-12 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <List className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm mb-4">No subcategories found.</p>
          <Link href="/admin/subcategories/new" className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white">
            <Plus className="h-4 w-4" /> Add Subcategory
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Subcategory</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Parent Category</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Order</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => (
                <tr key={sub.id} className={`border-b border-zinc-800/50 hover:bg-zinc-900/40 transition ${i % 2 === 0 ? "" : "bg-zinc-950/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center">
                        <List className="h-4 w-4 text-zinc-500" />
                      </div>
                      <span className="font-medium text-zinc-100">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{catName(sub.categoryId)}</td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{sub.slug}</td>
                  <td className="px-4 py-3 text-zinc-400">{sub.displayOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(sub)}
                      className={`text-xs px-2 py-0.5 rounded-full transition ${
                        sub.status === 1
                          ? "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70"
                          : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                      }`}
                    >
                      {sub.status === 1 ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/subcategories/${sub.id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(sub.id, sub.name)}
                        disabled={deleting === sub.id}
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
        title="Delete subcategory"
        description={`Delete subcategory "${confirmDelete?.name}"? Products will be uncategorized.`}
        loading={deleting === confirmDelete?.id}
      />
    </div>
  );
}
