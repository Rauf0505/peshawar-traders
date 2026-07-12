"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAttributes, deleteAttribute } from "@/lib/api-client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function AttributeListPage() {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const load = () => {
    setLoading(true);
    getAttributes().then((a) => { setAttributes(a); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, name: string) => setConfirmDelete({ id, name });

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.id);
    try {
      await deleteAttribute({ data: { token: getToken(), id: confirmDelete.id } });
      toast.success("Attribute deleted");
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      text: "bg-blue-900/50 text-blue-300",
      select: "bg-amber-900/50 text-amber-300",
      color_swatch: "bg-purple-900/50 text-purple-300",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[type] || "bg-zinc-800 text-zinc-500"}`}>
        {type.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-display font-medium text-zinc-100">Attributes</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{attributes.length} attribute{attributes.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/attributes/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
        >
          <Plus className="h-4 w-4" />
          Add Attribute
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : attributes.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-zinc-500 text-sm mb-4">No attributes yet.</p>
          <Link
            href="/admin/attributes/new"
            className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
          >
            <Plus className="h-4 w-4" /> Add Attribute
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Variant Defining</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {attributes.map((a, i) => (
                <tr key={a.id} className={`border-b border-zinc-800/50 hover:bg-zinc-900/40 transition ${i % 2 === 0 ? "" : "bg-zinc-950/30"}`}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-100">{a.name}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{a.slug}</td>
                  <td className="px-4 py-3">{typeBadge(a.type)}</td>
                  <td className="px-4 py-3">
                    {a.isVariantDefining === 1 ? (
                      <span className="text-xs text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-xs text-zinc-600">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{a.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/attributes/${a.id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.name)}
                        disabled={deleting === a.id}
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
        title="Delete attribute"
        description={`Delete "${confirmDelete?.name}"? This will also remove it from all categories and delete its options.`}
        loading={deleting === confirmDelete?.id}
      />
    </div>
  );
}
