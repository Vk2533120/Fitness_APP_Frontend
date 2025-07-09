// frontend/src/components/Reviews/ReviewList.jsx
import React from 'react';

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return null; // Will be handled by parent TrainerProfilePage
  }

  return (
    <div className="mt-8">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-5 rounded-lg shadow-md mb-4 border-l-4 border-purple-400">
          <div className="flex items-center mb-3">
            {review.user.profilePicture && (
              <img
                src={review.user.profilePicture}
                alt={review.user.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            )}
            <div>
              <p className="font-semibold text-gray-800">{review.user.name}</p>
              <div className="flex items-center text-yellow-500 text-lg">
                {'⭐'.repeat(review.rating)}
                <span className="ml-2 text-gray-600 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;