// frontend/src/pages/FeedbackPage.jsx
import React, { useState } from 'react';
import { feedbackApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function FeedbackPage() {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showContextMessage } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showContextMessage('Please enter your feedback.', true);
      return;
    }
    setSubmitting(true);
    try {
      const response = await feedbackApi.submitFeedback({ comment, type: 'app' }); // 'app' type for general feedback
      showContextMessage(response.data.message || 'Feedback submitted successfully!', false);
      setComment('');
      // Optionally redirect after submission
      // navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback.';
      showContextMessage(errorMessage, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg max-w-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Provide General App Feedback</h2>
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-sm">
        <div className="mb-6">
          <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Your Feedback:</label>
          <textarea
            id="comment"
            rows="7"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength="500"
            placeholder="Share your thoughts, suggestions, or report issues here..."
            required
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

export default FeedbackPage;