"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { getBrands, deleteBrand } from "@/lib/api-client";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { Plus, Pencil, Trash2, Tag, Globe } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function BrandListPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const load = () => {
    setLoading(true);
    getBrands().then((b) => { setBrands(b); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, name: string) => setConfirmDelete({ id, name });

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.id);
    try {
      await deleteBrand({ data: { token: getToken(), id: confirmDelete.id } });
      toast.success("Brand deleted successfully");
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
        <div>
          <h1 className="text-lg font-display font-medium text-zinc-100">Brands</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{brands.length} brand{brands.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Link>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm py-12 text-center">Loading…</div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <Tag className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm mb-4">No brands yet. Add your first brand to get started.</p>
          <Link href="/admin/brands/new" className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white">
            <Plus className="h-4 w-4" /> Add Brand
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Brand</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Country</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Products</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, i) => (
                <tr key={brand.id} className={`border-b border-zinc-800/50 hover:bg-zinc-900/40 transition ${i % 2 === 0 ? "" : "bg-zinc-950/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain rounded bg-zinc-800 p-1" />
                      ) : (
                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center">
                          <Tag className="h-4 w-4 text-zinc-500" />
                        </div>
                      )}
                      <span className="font-medium text-zinc-100">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    <span className="mr-1.5">
                      {COUNTRY_CODE[brand.country] ? getFlagEmoji(COUNTRY_CODE[brand.country]) : "🌐"}
                    </span>
                    {brand.country}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{brand.slug}</td>
                  <td className="px-4 py-3 text-zinc-400">{brand.productCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/brands/${brand.id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(brand.id, brand.name)}
                        disabled={deleting === brand.id}
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
        title="Delete brand"
        description={`Delete brand "${confirmDelete?.name}"? This cannot be undone.`}
        loading={deleting === confirmDelete?.id}
      />
    </div>
  );
}
