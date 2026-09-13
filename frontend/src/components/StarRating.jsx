import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, reviewCount = null, size = 'w-4 h-4' }) {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div className="flex items-center space-x-1">
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700 ml-1">
        {rounded > 0 ? rounded.toFixed(1) : 'New'}
      </span>
      {reviewCount !== null && (
        <span className="text-xs text-slate-500">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
