import { useState, useEffect, useCallback } from "react";
import { StarRating } from "./StarRating";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";
import { getProductReviews } from "@/lib/api/reviews.server";
import { Star, MessageSquare, ChevronDown } from "lucide-react";

export function ProductReviews({
  productId,
  reviews,
  loading,
  fetchReviews,
}: {
  productId: number;
  reviews: any[];
  loading: boolean;
  fetchReviews: () => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="flex flex-col lg:flex-row lg:items-start gap-10">
        {/* Rating Summary */}
        <div className="lg:w-80 shrink-0 bg-secondary/30 border border-border/50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-6">
            <MessageSquare size={16} className="text-accent" />
            Customer Reviews
          </h3>

          {reviews.length > 0 ? (
            <>
              <div className="flex items-center gap-3.5 mb-5">
                <span className="text-4xl font-bold tracking-tight">
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={avgRating} size={14} />
                  <p className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                    Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="space-y-2 mt-4">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                    <span className="w-3">{star}</span>
                    <Star size={10} className="text-accent fill-accent" />
                    <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{
                          width: `${reviews.length > 0 ? (ratingCounts[star] / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-6 text-right">{ratingCounts[star]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground mb-4">No reviews yet for this product.</p>
          )}

          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold uppercase tracking-wider hover:scale-[1.01] transition-all shadow-sm cursor-pointer"
          >
            <Star size={14} />
            Write a Review
            <ChevronDown size={14} className={`transition-transform duration-200 ${showForm ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Reviews List or Form */}
        <div className="flex-1 min-w-0">
          {showForm ? (
            <div className="bg-secondary/20 border border-border/40 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider">Write Your Review</h4>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <ReviewForm
                productId={productId}
                onReviewSubmitted={() => {
                  setShowForm(false);
                  fetchReviews();
                }}
              />
            </div>
          ) : (
            <ReviewList reviews={reviews} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}
