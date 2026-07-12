"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminHeroSlides, deleteHeroSlide, reorderHeroSlides } from "@/lib/api-client";
import { Plus, Pencil, Trash2, Image, Video, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function HeroListPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const load = () => {
    setLoading(true);
    getAdminHeroSlides().then((s) => { setSlides(s); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, name: string) => setConfirmDelete({ id, name });

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete.id);
    try {
      await deleteHeroSlide({ data: { token: getToken(), id: confirmDelete.id } });
      toast.success("Slide deleted successfully");
      load();
    } catch {
      toast.error("Delete failed. Make sure you're logged in.");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const handleMove = async (id: number, direction: 1 | -1) => {
    const idx = slides.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= slides.length) return;

    const updated = [...slides];
    const temp = updated[idx].slideOrder;
    updated[idx] = { ...updated[idx], slideOrder: updated[newIdx].slideOrder };
    updated[newIdx] = { ...updated[newIdx], slideOrder: temp };
    updated.sort((a, b) => a.slideOrder - b.slideOrder);

    setSlides(updated);
    try {
      await reorderHeroSlides({
        data: {
          token: getToken(),
          slides: updated.map((s, i) => ({ id: s.id, slideOrder: i + 1 })),
        },
      });
    } catch {
      toast.error("Reorder failed");
      load();
    }
  };

  const heading = (s: any) => s.headingLine1 || s.headingLine2 || "(No heading)";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-display font-medium text-zinc-100">Hero Slides</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/hero/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
        >
          <Plus className="h-4 w-4" />
          Add Slide
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <Image className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm mb-4">No hero slides yet.</p>
          <Link
            href="/admin/hero/new"
            className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white"
          >
            <Plus className="h-4 w-4" /> Add Slide
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Preview</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Heading</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Media</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Duration</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Active</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {slides.map((s, i) => (
                <tr key={s.id} className={`border-b border-zinc-800/50 hover:bg-zinc-900/40 transition ${i % 2 === 0 ? "" : "bg-zinc-950/30"}`}>
                  <td className="px-4 py-3">
                    <div className="h-10 w-16 rounded bg-zinc-800 overflow-hidden">
                      {s.mediaType === "video" ? (
                        <video src={s.mediaUrl} muted className="h-full w-full object-cover" />
                      ) : (
                        <img src={s.mediaUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-100">{heading(s)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      {s.mediaType === "video" ? <Video className="h-3.5 w-3.5" /> : <Image className="h-3.5 w-3.5" />}
                      {s.mediaType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{s.duration}s</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive === 1 ? "bg-emerald-900/50 text-emerald-300" : "bg-zinc-800 text-zinc-500"}`}>
                      {s.isActive === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(s.id, -1)}
                        disabled={i === 0}
                        className="grid h-6 w-6 place-items-center rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition disabled:opacity-30"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-zinc-500 text-xs w-4 text-center">{s.slideOrder}</span>
                      <button
                        onClick={() => handleMove(s.id, 1)}
                        disabled={i === slides.length - 1}
                        className="grid h-6 w-6 place-items-center rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition disabled:opacity-30"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/hero/${s.id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id, heading(s))}
                        disabled={deleting === s.id}
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
        title="Delete slide"
        description={`Delete slide "${confirmDelete?.name}"? This cannot be undone.`}
        loading={deleting === confirmDelete?.id}
      />
    </div>
  );
}
