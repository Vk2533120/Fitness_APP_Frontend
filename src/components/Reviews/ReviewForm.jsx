// frontend/src/components/Reviews/ReviewForm.jsx
import React, { useState } from 'react';
import { trainerApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

function ReviewForm({ trainerId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showContextMessage } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showContextMessage('Please select a rating.', true);
      return;
    }
    setSubmitting(true);
    try {
      const response = await trainerApi.addReview(trainerId, { rating, comment });
      showContextMessage(response.data.message || 'Review added successfully!', false);
      setRating(0);
      setComment('');
      if (onReviewAdded) {
        onReviewAdded(); // Notify parent to refresh reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add review.';
      showContextMessage(errorMessage, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
      <h4 className="text-xl font-bold text-gray-800 mb-4">Add Your Review</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              >
                &#9733; {/* Unicode star character */}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comment (optional):</label>
          <textarea
            id="comment"
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength="500"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;