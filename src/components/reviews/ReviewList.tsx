import React from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useReviewStore } from '../../store/reviewStore';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  courseId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ courseId }) => {
  const reviews = useReviewStore((state) => state.getReviewsByCourse(courseId));

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white/95">
            Course Reviews ({reviews.length})
          </h3>
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`w-5 h-5 ${
                    value <= averageRating
                      ? 'text-indigo-400 fill-current'
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="ml-3 text-sm text-white/70">
              {averageRating.toFixed(1)} out of 5
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5">
                <img
                  src={`https://i.pravatar.cc/40?u=${review.userId}`}
                  alt="Reviewer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white/90">
                      User {review.userId.slice(0, 8)}
                    </h4>
                    <div className="mt-1 flex items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`w-4 h-4 ${
                            value <= review.rating
                              ? 'text-indigo-400 fill-current'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/50">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{review.content}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <button className="flex items-center text-sm text-white/50 hover:text-white/70 transition-colors">
                    <ThumbsUp className="w-4 h-4 mr-1.5" />
                    Helpful
                  </button>
                  <button className="flex items-center text-sm text-white/50 hover:text-white/70 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};