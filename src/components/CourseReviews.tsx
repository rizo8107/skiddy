import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John Doe',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent course! The content is well-structured and easy to follow.'
  },
  {
    id: '2',
    author: 'Jane Smith',
    rating: 4.5,
    date: '1 week ago',
    comment: 'Very informative and practical. Would recommend to others.'
  }
];

export const CourseReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      author: 'You', // In a real app, this would come from user authentication
      rating,
      date: 'Just now',
      comment: comment.trim()
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
  };

  const renderStars = (value: number, interactive = false) => {
    const stars = [];
    const displayRating = interactive ? hoveredRating || rating : value;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            onMouseEnter={() => setHoveredRating(i)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(i)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                i <= displayRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-400'
              }`}
            />
          </button>
        );
      } else {
        if (i <= fullStars) {
          stars.push(
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          );
        } else if (i === Math.ceil(displayRating) && hasHalfStar) {
          stars.push(
            <StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          );
        } else {
          stars.push(
            <Star key={i} className="w-4 h-4 text-gray-400" />
          );
        }
      }
    }

    return stars;
  };

  const getAverageRating = () => {
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white/95 mb-3 sm:mb-0">Course Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {renderStars(parseFloat(getAverageRating()))}
          </div>
          <span className="text-white/60">({getAverageRating()})</span>
        </div>
      </div>
      
      {/* Review Form */}
      <form onSubmit={handleSubmitReview} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-white/90 mb-4">Write a Review</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <div className="flex gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {renderStars(rating, true)}
          </div>
          {rating > 0 && (
            <span className="text-sm text-white/60">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </span>
          )}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this course..."
          className="w-full px-4 py-3 rounded-lg bg-white/5 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/10 focus:border-white/20 transition-colors min-h-[100px]"
          required
        />
        <button
          type="submit"
          disabled={rating === 0 || !comment.trim()}
          className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-indigo-500/80 hover:bg-indigo-500/90 text-white/95 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </form>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
              <div>
                <h3 className="text-white/90 font-medium">{review.author}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <span className="text-sm text-white/50 order-first sm:order-last">{review.date}</span>
            </div>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
