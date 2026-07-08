import { useState, useEffect } from "react";
import { StarRating } from "./StarRating";
import { MessageSquare, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export function ReviewList({
  reviews,
  loading,
}: {
  reviews: any[];
  loading: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setPerPage(2);
        } else {
          setPerPage(3);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [reviews.length, perPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Loading reviews...
        </p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-secondary/40 border border-border/40 rounded-2xl">
        <MessageSquare size={32} className="mx-auto text-muted-foreground/60 mb-4" />
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          No reviews yet
        </p>
        <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
          Be the first to review this product
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(reviews.length / perPage);
  const start = currentPage * perPage;
  const visibleReviews = reviews.slice(start, start + perPage);

  return (
    <div className="space-y-6">
      {visibleReviews.map((review) => (
        <div
          key={review.id}
          className="bg-secondary/40 border border-border/40 rounded-2xl p-6 hover:border-border transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold uppercase">
                {review.reviewerName?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-tight">
                  {review.reviewerName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={review.rating} size={12} />
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {review.title && (
            <h4 className="text-sm font-semibold text-foreground mt-4 uppercase tracking-tight">
              {review.title}
            </h4>
          )}
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
            {review.comment}
          </p>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
