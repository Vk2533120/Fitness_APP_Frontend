// frontend/src/components/Bookings/UserBookings.jsx
import React, { useEffect, useState } from 'react'; // Removed useContext from here
import { bookingsApi } from '../../api/api';
// --- CHANGE THIS LINE ---
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook directly
import BookingCard from './BookingCard';

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- CHANGE THIS LINE ---
  const { user, showContextMessage } = useAuth(); // Use the hook directly to get context values

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsApi.getMyBookings();
      setBookings(response.data);
      console.log("Fetched bookings in UserBookings:", response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response && err.response.status === 404) {
          setError('Bookings service not found or no bookings available for your account.');
          showContextMessage('Bookings service not found or no bookings available. Please check backend deployment.', true);
      } else {
          setError(err.response?.data?.message || 'Failed to fetch bookings.');
          showContextMessage(err.response?.data?.message || 'Failed to fetch bookings.', true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleBookingUpdate = () => {
    fetchBookings();
  };

  if (loading) {
    return <div className="text-center py-8">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!bookings || bookings.length === 0) {
    return <div className="text-center py-8 text-gray-600">You have no bookings yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onBookingUpdate={handleBookingUpdate}
        />
      ))}
    </div>
  );
}

export default UserBookings;