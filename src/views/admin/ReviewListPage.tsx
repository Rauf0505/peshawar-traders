"use client";

import { useState, useEffect } from "react";
import { getAllReviews, updateReview, deleteReview } from "@/lib/api-client";
import { StarRating } from "@/components/site/StarRating";
import { Search, Trash2, Edit3, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

export function ReviewListPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    reviewerName: "",
    reviewerEmail: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getAllReviews({ data: { token: getToken() } });
      setReviews(res || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.reviewerName?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q) ||
      String(r.productId).includes(q)
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview({ data: { token: getToken(), id } });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const openEdit = (review: any) => {
    setEditingReview(review);
    setEditForm({
      reviewerName: review.reviewerName,
      reviewerEmail: review.reviewerEmail || "",
      rating: review.rating,
      title: review.title || "",
      comment: review.comment,
    });
  };

  const handleSave = async () => {
    if (!editForm.reviewerName.trim() || !editForm.comment.trim()) {
      toast.error("Name and comment are required");
      return;
    }
    setSaving(true);
    try {
      const res = await updateReview({
        data: {
          token: getToken(),
          id: editingReview.id,
          reviewerName: editForm.reviewerName,
          reviewerEmail: editForm.reviewerEmail,
          rating: editForm.rating,
          title: editForm.title,
          comment: editForm.comment,
        },
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === editingReview.id ? res : r))
      );
      toast.success("Review updated successfully");
      setEditingReview(null);
    } catch (err) {
      toast.error("Failed to update review");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-zinc-500 text-sm">Loading reviews…</div>
    );
  }

  return (
    <div className="p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-display font-medium text-zinc-100">Reviews</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Moderate customer reviews ({reviews.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, comment, or product ID..."
          className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition"
        />
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-850">
              <h2 className="text-sm font-semibold text-zinc-100">Edit Review</h2>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-xs text-zinc-500">
                Product ID: #{editingReview.productId}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editForm.reviewerName}
                    onChange={(e) => setEditForm({ ...editForm, reviewerName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editForm.reviewerEmail}
                    onChange={(e) => setEditForm({ ...editForm, reviewerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Rating</label>
                <StarRating
                  rating={editForm.rating}
                  size={20}
                  interactive={true}
                  onChange={(val) => setEditForm({ ...editForm, rating: val })}
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Comment</label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingReview(null)}
                  className="flex-1 py-2 rounded-md border border-zinc-800 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={32} className="mx-auto text-zinc-650 mb-4" />
            <p className="text-xs text-zinc-500">
              {search ? "No reviews match your search" : "No reviews yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-900/50">
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400">#</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400">Product</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400">Reviewer</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 text-center">Rating</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400">Comment</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 text-center">Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filtered.map((review) => (
                  <tr key={review.id} className="hover:bg-zinc-850/30 transition-colors">
                    <td className="py-4 px-4 text-xs text-zinc-500">#{review.id}</td>
                    <td className="py-4 px-4 text-xs text-zinc-400">Product #{review.productId}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 text-xs font-semibold uppercase">
                          {review.reviewerName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{review.reviewerName}</p>
                          {review.reviewerEmail && (
                            <p className="text-[10px] text-zinc-500">{review.reviewerEmail}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <StarRating rating={review.rating} size={12} />
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      {review.title && (
                        <p className="text-xs font-semibold text-zinc-200 mb-0.5">{review.title}</p>
                      )}
                      <p className="text-xs text-zinc-400 line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="py-4 px-4 text-center text-xs text-zinc-400">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(review)}
                          className="p-1.5 rounded-md text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
