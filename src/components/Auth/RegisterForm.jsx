import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });
  const { register, loading, showContextMessage } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/dashboard'); // Redirect on successful registration
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto my-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="your@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
            Register as:
          </label>
          <select
            id="role"
            name="role"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Member</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline-green transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-8 text-center text-gray-600 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-600 hover:text-purple-800 font-bold transition duration-200">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;