// frontend/src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-purple-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-300">
          FitnessHub
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-gray-300 transition duration-300">Dashboard</Link>
                </li>
                <li>
                  <Link to="/classes" className="hover:text-gray-300 transition duration-300">Classes</Link>
                </li>
                <li>
                  <Link to="/my-bookings" className="hover:text-gray-300 transition duration-300">My Bookings</Link>
                </li>
                {user && user.role === 'trainer' && (
                  <li>
                    <Link to="/add-class" className="hover:text-gray-300 transition duration-300">Add Class</Link>
                  </li>
                )}
                {/* Add new Trainer Profiles link here */}
                <li>
                  <Link to="/trainers" className="hover:text-gray-300 transition duration-300">Trainers</Link>
                </li>
                {user && user.role === 'trainer' && (
                  <li>
                    <Link to="/trainer/edit-profile" className="hover:text-gray-300 transition duration-300">Edit Profile</Link>
                  </li>
                )}
                <li className="text-gray-200">Hello, {user ? user.name : 'Guest'}!</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-300 transition duration-300">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-300 transition duration-300">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;