import React from 'react';
import { Star, Edit2, Trash2, User as UserIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, Review, getCurrentUser, User, getFileUrl, pb } from '../lib/pocketbase';

interface ReviewListProps {
  courseId: string;
}

interface ReviewWithUser extends Review {
  expand?: {
    user: User;
  };
}

export const ReviewList: React.FC<ReviewListProps> = ({ courseId }) => {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingReview, setEditingReview] = React.useState<ReviewWithUser | null>(null);
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', courseId],
    queryFn: () => reviewService.getAll(courseId),
  });

  const createMutation = useMutation({
    mutationFn: (data: { course: string; rating: number; comment: string }) =>
      reviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] });
      setComment('');
      setRating(5);
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'Failed to create review');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { rating: number; comment: string } }) =>
      reviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] });
      setIsEditing(false);
      setEditingReview(null);
      setComment('');
      setRating(5);
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'Failed to update review');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'Failed to delete review');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to create a review');
      return;
    }

    if (isEditing && editingReview) {
      updateMutation.mutate({
        id: editingReview.id,
        data: {
          rating,
          comment,
        },
      });
    } else {
      createMutation.mutate({
        course: courseId,
        rating,
        comment,
      });
    }
  };

  const handleEdit = (review: ReviewWithUser) => {
    if (!currentUser) {
      alert('You must be logged in to edit a review');
      return;
    }
    setIsEditing(true);
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = (reviewId: string) => {
    if (!currentUser) {
      alert('You must be logged in to delete a review');
      return;
    }
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(reviewId);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-indigo-400 fill-indigo-400' : 'text-white/20'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-semibold text-white/95 mb-6">Course Reviews</h2>
        <div className="text-center text-white/60">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-white/95 mb-6">Course Reviews</h2>

      {/* Review Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-white/70 mb-2">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      index < rating ? 'text-indigo-400 fill-indigo-400' : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white/70 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 text-white/90 placeholder-white/40 rounded-lg border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500/80 hover:bg-indigo-500/90 text-white/95 rounded-lg transition-colors disabled:opacity-50"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Update Review' : 'Submit Review'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingReview(null);
                setComment('');
                setRating(5);
              }}
              className="ml-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/90 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <div className="mb-8 text-center text-white/60">
          Please log in to leave a review
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors duration-200"
          >
            <div className="flex items-start space-x-4">
              {review.expand?.user?.avatar ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5">
                  <img
                    src={pb.files.getUrl(review.expand.user, review.expand.user.avatar)}
                    alt={review.expand.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white/90">
                      {review.expand?.user?.name || 'Anonymous'}
                    </h4>
                    <div className="mt-1 flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {currentUser && review.user === currentUser.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-white/50 hover:text-white/70 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-white/50 hover:text-white/70 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-white/60">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};
