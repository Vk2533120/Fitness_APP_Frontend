// frontend/src/pages/TrainerProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { trainerApi } from '../api/api';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewList from '../components/Reviews/ReviewList';
import { useAuth } from '../context/AuthContext';

function TrainerProfilePage() {
  const { id } = useParams(); // Get trainer ID from URL
  const [trainer, setTrainer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, showContextMessage } = useAuth(); // Get logged-in user and message function
  const [hasReviewed, setHasReviewed] = useState(false); // To prevent multiple reviews

  const fetchTrainerData = async () => {
    try {
      const trainerResponse = await trainerApi.getTrainerProfile(id);
      setTrainer(trainerResponse.data.data);

      const reviewsResponse = await trainerApi.getTrainerReviews(id);
      setReviews(reviewsResponse.data.data);

      // Check if logged-in user has already reviewed this trainer
      if (user && user._id) {
        const userReview = reviewsResponse.data.data.find(review => review.user._id === user._id);
        setHasReviewed(!!userReview);
      }

    } catch (err) {
      console.error('Error fetching trainer profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load trainer profile.';
      setError(errorMessage);
      showContextMessage(errorMessage, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerData();
  }, [id, user, showContextMessage]); // Re-fetch if ID or user changes

  // Callback to refresh reviews after a new review is added
  const handleReviewAdded = () => {
    fetchTrainerData(); // Re-fetch all trainer data to update reviews and average rating
    setHasReviewed(true); // Mark as reviewed
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading trainer profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  if (!trainer) {
    return <div className="text-center text-xl mt-8">Trainer not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 p-6">
        {trainer.profilePicture && (
          <img
            src={trainer.profilePicture}
            alt={trainer.name}
            className="w-48 h-48 rounded-full object-cover border-4 border-purple-500 shadow-md"
          />
        )}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{trainer.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{trainer.bio || 'No introductory message provided.'}</p>

          {trainer.qualifications && trainer.qualifications.length > 0 && (
            <p className="text-md text-gray-600 mb-1">
              <span className="font-semibold">Qualifications:</span> {trainer.qualifications.join(', ')}
            </p>
          )}
          {trainer.expertise && trainer.expertise.length > 0 && (
            <p className="text-md text-gray-600 mb-1">
              <span className="font-semibold">Expertise:</span> {trainer.expertise.join(', ')}
            </p>
          )}
          {trainer.specializations && trainer.specializations.length > 0 && (
            <p className="text-md text-gray-600 mb-4">
              <span className="font-semibold">Specializations:</span> {trainer.specializations.join(', ')}
            </p>
          )}

          <div className="flex items-center justify-center md:justify-start space-x-2 text-yellow-500 text-xl mb-4">
            {/* Display stars for average rating */}
            {'⭐'.repeat(Math.round(trainer.averageRating))}
            <span className="text-gray-700 text-base">
              ({trainer.averageRating.toFixed(1)} / 5 - {trainer.reviewCount} reviews)
            </span>
          </div>

          {trainer.videoIntro && (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-800 mb-3">Introductory Video</h4>
              <video controls src={trainer.videoIntro} className="w-full max-w-md rounded-lg shadow-md mx-auto md:mx-0"></video>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 p-6 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Client Reviews</h3>
        {user && user.role === 'user' && !hasReviewed && (
          <ReviewForm trainerId={trainer._id} onReviewAdded={handleReviewAdded} />
        )}
        <ReviewList reviews={reviews} />
        {reviews.length === 0 && <p className="text-center text-gray-600 mt-4">No reviews yet. Be the first!</p>}
      </div>
    </div>
  );
}

export default TrainerProfilePage;