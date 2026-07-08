import { useState } from "react";
import { StarRating } from "./StarRating";
import { createReview } from "@/lib/api/reviews.server";
import { toast } from "sonner";

export function ReviewForm({
  productId,
  onReviewSubmitted,
}: {
  productId: number;
  onReviewSubmitted: () => void;
}) {
  const [form, setForm] = useState({
    reviewerName: "",
    reviewerEmail: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!form.reviewerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!form.comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createReview({
        data: {
          productId,
          reviewerName: form.reviewerName.trim(),
          reviewerEmail: form.reviewerEmail.trim(),
          rating: form.rating,
          title: form.title.trim(),
          comment: form.comment.trim(),
        },
      });
      toast.success("Thank you! Your review has been submitted.");
      setForm({ reviewerName: "", reviewerEmail: "", rating: 0, title: "", comment: "" });
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-secondary border border-border/80 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all duration-200";
  const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.reviewerName}
            onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
            placeholder="Your name"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            value={form.reviewerEmail}
            onChange={(e) => setForm({ ...form, reviewerEmail: e.target.value })}
            placeholder="your@email.com"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <StarRating
            rating={form.rating}
            size={24}
            interactive={true}
            onChange={(val) => setForm({ ...form, rating: val })}
          />
          {form.rating > 0 && (
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {form.rating === 1
                ? "Poor"
                : form.rating === 2
                ? "Fair"
                : form.rating === 3
                ? "Good"
                : form.rating === 4
                ? "Very Good"
                : "Excellent"}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className={labelCls}>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Summary of your review"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Share your experience with this product..."
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-500 bg-red-50/80 px-3 py-2 rounded-lg border border-red-100">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground rounded-xl text-xs uppercase tracking-[0.2em] font-semibold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-md cursor-pointer"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
