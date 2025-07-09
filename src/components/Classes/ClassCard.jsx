// ClassCard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { bookingsApi } from '../../api/api.js';

function ClassCard({ fitnessClass, onBookSuccess, onCancelSuccess }) {
  const { user, isAuthenticated, showContextMessage } = useAuth();
  const isTrainer = user?.role === 'trainer';
  const isBooked = fitnessClass.bookedBy?.includes(user?._id);
  console.log("ClassCard received fitnessClass:", fitnessClass)

  const handleBookClass = async () => {
    if (!isAuthenticated) {
      showContextMessage('Please log in to book a class.', true);
      return;
    }
    if (isTrainer) {
      showContextMessage('Trainers cannot book classes.', true);
      return;
    }

    try {
      const classId = fitnessClass._id;

      // --- SIMPLIFICATION FOR TRAINER ID ---
      // Get Trainer ID only if available from populated data
      const trainerId = fitnessClass.trainer?._id;
      // Removed the 'if (!fitnessClass.trainer || !fitnessClass.trainer._id)' check here
      // This allows the booking attempt even if trainer info isn't fully populated from old data.
      // The backend's Booking model might still require it if not updated.

      let bookingDate;
      try {
        if (!fitnessClass.date || !fitnessClass.startTime) {
          showContextMessage('Class date or time information is incomplete.', true);
          return;
        }
        const dateTimeString = `${fitnessClass.date}T${fitnessClass.startTime}:00`;
        const dateObject = new Date(dateTimeString);

        if (isNaN(dateObject.getTime())) {
          showContextMessage('Invalid class date or time format.', true);
          return;
        }
        bookingDate = dateObject.toISOString();
      } catch (e) {
        console.error("Error creating bookingDate:", e);
        showContextMessage('Failed to process class date/time for booking.', true);
        return;
      }

      // Construct the payload. Only include trainer if trainerId is available.
      const payload = {
        class: classId,
        bookingDate: bookingDate,
      };

      if (trainerId) { // Conditionally add trainer to payload
        payload.trainer = trainerId;
      }

      const response = await bookingsApi.bookClass(payload);

      showContextMessage(response.data.message || 'Class booked successfully!', false);
      if (onBookSuccess) onBookSuccess(fitnessClass._id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to book class.';
      showContextMessage(errorMessage, true);
    }
  };

  const handleCancelBooking = async () => {
    if (!isAuthenticated) {
      showContextMessage('Please log in to cancel a booking.', true);
      return;
    }
    if (isTrainer) {
      showContextMessage('Trainers cannot cancel member bookings.', true);
      return;
    }

    try {
      const response = await bookingsApi.cancelBooking(fitnessClass._id);
      showContextMessage(response.data.message || 'Booking cancelled successfully!', false);
      if (onCancelSuccess) onCancelSuccess(fitnessClass._id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking.';
      showContextMessage(errorMessage, true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{fitnessClass.title}</h3>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Trainer:</span> {fitnessClass.trainer?.name || 'N/A'}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Date:</span> {new Date(fitnessClass.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Time:</span> {fitnessClass.startTime}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Duration:</span> {fitnessClass.duration} minutes
        </p>
        <p className="text-gray-700 mt-3 text-base">{fitnessClass.description}</p>
      </div>
      <div className="p-5 bg-gray-50 border-t flex justify-between items-center">
        {!isTrainer && isAuthenticated && (
          isBooked ? (
            <button
              onClick={handleCancelBooking}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 text-sm"
            >
              Cancel Booking
            </button>
          ) : (
            <button
              onClick={handleBookClass}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 text-sm"
            >
              Book Class
            </button>
          )
        )}
        {isTrainer && (
          <span className="text-gray-500 text-sm italic">Trainer's Class</span>
        )}
        {!isAuthenticated && (
          <span className="text-gray-500 text-sm italic">Log in to book</span>
        )}
        <span className="text-lg font-bold text-green-600">
          ${fitnessClass.price ? fitnessClass.price.toFixed(2) : '0.00'}
        </span>
      </div>
    </div>
  );
}

export default ClassCard;