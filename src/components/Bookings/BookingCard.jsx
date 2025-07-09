// frontend/src/components/Bookings/BookingCard.jsx
import React from 'react';
import { bookingsApi } from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

function BookingCard({ booking, onBookingUpdate }) {
  const { showContextMessage } = useAuth();

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const response = await bookingsApi.cancelBooking(booking._id);
      showContextMessage(response.data.message || 'Booking cancelled successfully!', false);
      if (onBookingUpdate) onBookingUpdate(); // Notify parent to refresh list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking.';
      showContextMessage(errorMessage, true);
    }
  };

  const handleRescheduleBooking = async () => {
    const currentBookingDateTime = new Date(booking.bookingDate);
    // Format for prompt: YYYY-MM-DDTHH:mm for better compatibility with Date constructor
    const defaultDateTime = `${currentBookingDateTime.getFullYear()}-${(currentBookingDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentBookingDateTime.getDate().toString().padStart(2, '0')}T${currentBookingDateTime.getHours().toString().padStart(2, '0')}:${currentBookingDateTime.getMinutes().toString().padStart(2, '0')}`;

    const newDateTimeString = prompt(`Enter new date and time for rescheduling (YYYY-MM-DDTHH:mm):`, defaultDateTime);

    if (newDateTimeString === null || newDateTimeString.trim() === '') {
      return;
    }

    const newDate = new Date(newDateTimeString);
    if (isNaN(newDate.getTime())) {
      showContextMessage('Invalid date or time format. Please use YYYY-MM-DDTHH:mm', true);
      return;
    }

    try {
      // Send the ISO string to the backend
      const response = await bookingsApi.rescheduleBooking(booking._id, newDate.toISOString());
      showContextMessage(response.data.message || 'Booking rescheduled successfully!', false);
      if (onBookingUpdate) onBookingUpdate();
    } catch (error) {
      console.error('Reschedule error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reschedule booking.';
      showContextMessage(errorMessage, true);
    }
  };

  const classDetails = booking.class;

  // This block handles cases where classDetails might not be populated
  if (!classDetails || typeof classDetails !== 'object' || !classDetails._id) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-red-500">Class details not available for this booking. (Class ID: {booking.class})</p>
        <p className="text-gray-500 text-sm">Booking ID: {booking._id}</p>
        <p className="text-gray-500 text-sm">Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
        {/* Still show cancel if class details are missing but booking status is confirmed */}
        {booking.status === 'confirmed' && (
          <button
            onClick={handleCancelBooking}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 text-sm"
          >
            Cancel Booking
          </button>
        )}
      </div>
    );
  }

  // Safely access trainer name from populated trainer object
  const trainerName = classDetails.trainer && typeof classDetails.trainer === 'object' && classDetails.trainer.name
    ? classDetails.trainer.name
    : 'N/A';

  // Format booking date/time from booking.bookingDate
  let displayBookingDate = 'Invalid Date';
  let displayBookingTime = 'Invalid Time';

  try {
    const bookingDateTime = new Date(booking.bookingDate);
    if (!isNaN(bookingDateTime.getTime())) {
      displayBookingDate = bookingDateTime.toLocaleDateString();
      displayBookingTime = bookingDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch (e) {
    console.error('Error parsing booking date:', e);
  }


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{classDetails.title || 'Class Title N/A'}</h3>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Trainer:</span> {trainerName}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Booking Date:</span> {displayBookingDate}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Booking Time:</span> {displayBookingTime}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Duration:</span> {classDetails.duration ? `${classDetails.duration} minutes` : 'N/A'}
        </p>
        <p className={`mt-3 text-base font-semibold ${booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
          Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </p>
      </div>
      <div className="p-5 bg-gray-50 border-t flex justify-between items-center">
        {/* NOW MATCHES 'confirmed' status for active bookings */}
        {booking.status === 'confirmed' && ( // <--- IMPORTANT CHANGE HERE
          <div className="flex space-x-2">
            <button
              onClick={handleCancelBooking}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 text-sm"
            >
              Cancel Booking
            </button>
            <button
              onClick={handleRescheduleBooking}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 text-sm"
            >
              Reschedule
            </button>
          </div>
        )}
        <span className="text-lg font-bold text-gray-800">
          ${classDetails.price !== undefined && classDetails.price !== null ? classDetails.price.toFixed(2) : '0.00'}
        </span>
      </div>
    </div>
  );
}

export default BookingCard;