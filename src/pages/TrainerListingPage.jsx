// frontend/src/pages/TrainerListingPage.jsx
import React, { useEffect, useState } from 'react';
import { trainerApi } from '../api/api';
import TrainerCard from '../components/Trainers/TrainerCard';
import { useAuth } from '../context/AuthContext'; // Assuming useAuth for messages

function TrainerListingPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showContextMessage } = useAuth(); // For displaying error messages

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await trainerApi.getTrainers();
        setTrainers(response.data.data);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load trainers.';
        setError(errorMessage);
        showContextMessage(errorMessage, true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [showContextMessage]);

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading trainers...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  if (trainers.length === 0) {
    return <div className="text-center text-xl mt-8">No trainers found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Expert Trainers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <TrainerCard key={trainer._id} trainer={trainer} />
        ))}
      </div>
    </div>
  );
}

export default TrainerListingPage;