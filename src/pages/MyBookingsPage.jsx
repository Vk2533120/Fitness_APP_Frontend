import React from 'react';
import UserBookings from '../components/Bookings/UserBookings.jsx';

function MyBookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">My Bookings</h1>
      <UserBookings />
    </div>
  );
}

export default MyBookingsPage;