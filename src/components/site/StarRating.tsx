"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  const displayRating = interactive ? hovered || rating : rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${
            interactive ? "cursor-pointer hover:scale-110 transition-transform focus:outline-none" : ""
          }`}
        >
          <Star
            size={size}
            className={`${
              star <= displayRating
                ? "text-accent fill-accent"
                : "text-border fill-transparent"
            } transition-colors duration-150`}
          />
        </button>
      ))}
    </div>
  );
}
