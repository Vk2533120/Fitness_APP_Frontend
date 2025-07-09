import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // To check if user is logged in

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center bg-gray-50 p-8 rounded-lg shadow-xl">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Your Journey to a Healthier You Starts Here
      </h1>
      <p className="text-xl text-gray-700 mb-10 max-w-2xl">
        Discover and book a wide range of fitness classes, track your progress, and connect with expert trainers.
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-purple-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/classes"
              className="px-8 py-4 border border-indigo-600 text-indigo-600 text-lg font-bold rounded-full shadow-lg hover:bg-indigo-50 transition duration-300 transform hover:scale-105"
            >
              Explore Classes
            </Link>
          </>
        )}
      </div>

      <div className="mt-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Diverse Classes</h3>
          <p className="text-gray-600">From Yoga to HIIT, find classes that fit your style and goals.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Expert Trainers</h3>
          <p className="text-gray-600">Learn from certified professionals dedicated to your success.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Easy Booking</h3>
          <p className="text-gray-600">Book and manage your sessions effortlessly with a few clicks.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;